import axios from "axios";
import * as soap from "soap";
import * as fs from 'fs/promises';
import * as path from 'path';
import { DOMParser } from 'xmldom';
const WSDL_URL =
  "https://elearning.hs-albsig.de/webservice/soap/server.php?wsdl";
const ENDPOINT_URL =
  "https://elearning.hs-albsig.de:443/webservice/soap/server.php";
const NAMESPACE = "urn:ilUserAdministration";

interface LoginArgs {
  client: string; // e.g. your “service name” in ILIAS
  username: string; // the webservice‐user you created
  password: string; // its password
}

// Für die ILIAS SOAP API, wenn wir Zugriff bekommen sollten, bzw. wenn Soap API verfügbar ist
async function loginToIlias({ client, username, password }: LoginArgs) {
  try {
    // 1. SOAP-Client erstellen
    const soapClient = await soap.createClientAsync(WSDL_URL);

    // Optional: Logge die Anfrage und die Antwort für Debugging-Zwecke
    soapClient.on("request", (xml, eid) => {
      console.log("SOAP Request EID:", eid);
      console.log("Request XML:", xml);
    });
    soapClient.on("response", (body, response, eid) => {
      console.log("SOAP Response EID:", eid);
      console.log("Response Body:", body);
    });

    soapClient.setEndpoint(ENDPOINT_URL);

    // 2. Die 'login'-Methode aufrufen
    // Die Argumente werden als einzelnes Objekt übergeben
    const result = await soapClient.loginAsync({
      client,
      username,
      password,
    });

    // 3. Die Session-ID (sid) aus der Antwort extrahieren
    // Das Ergebnis ist oft ein Array, wir nehmen das erste Element.
    const sid = result[0].sid;

    if (sid) {
      console.log("Erfolgreich bei ILIAS angemeldet. Session-ID:", sid);
      return sid.$value;
    } else {
      // Dieser Fall sollte eigentlich durch einen Fehler im catch-Block abgefangen werden
      throw new Error("Anmeldung fehlgeschlagen, keine Session-ID erhalten.");
    }
  } catch (error: any) {
    // 4. Fehler abfangen und loggen
    console.error("Fehler beim ILIAS-Login:");
    // 'error.root.Envelope.Body.Fault' enthält oft die detaillierte Fehlermeldung vom SOAP-Server
    if (error.root && error.root.Envelope.Body.Fault) {
      console.error(JSON.stringify(error.root.Envelope.Body.Fault, null, 2));
    } else {
      console.error(error);
    }
    throw new Error("ILIAS Login-Vorgang ist fehlgeschlagen.");
  }
}

async function getUserIdBySid(sid: string) {
  try {
    const soapClient = await soap.createClientAsync(WSDL_URL);
    soapClient.setEndpoint(ENDPOINT_URL);
    // Aufruf der 'getUserIdBySid'-Methode
    soapClient.on("request", (xml, eid) => {
      console.log("SOAP Request EID:", eid);
      console.log("Request XML:", xml);
    });
    const result = await soapClient.getUserIdBySidAsync({ sid });
    // Extrahiere die User-ID aus dem Ergebnis
    console.log("SOAP Response:", result);
    const userId = result[0].usr_id.$value;
    if (userId) {
      console.log("User ID:", userId);
      return userId as number;
    } else {
      throw new Error("Keine User-ID erhalten.");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der User-ID:", error);
    throw error;
  }
}

async function getRolesForUser(sid: string, userId: number) {
  try {
    const soapClient = await soap.createClientAsync(WSDL_URL);
    soapClient.setEndpoint(ENDPOINT_URL);
    // Aufruf der 'getRolesForUser'-Methode
    const result = await soapClient.getUserRolesAsync({
      sid,
      user_id: userId,
    });
    // Extrahiere die Rollen aus dem Ergebnis
    console.log("SOAP Response:", result);
    return result[0].role_xml; // Die Rollen sind im 'role_xml'-Feld
  } catch (error) {
    console.error("Fehler beim Abrufen der Rollen für den Benutzer:", error);
    throw error;
  }
}

async function getCoursesForUser(
  sid: string,
  userId: number,
  status = 1 /* MEMBER only */
): Promise<string> {
  const url = "https://elearning.hs-albsig.de:443/webservice/soap/server.php";

  // Construct the parameters XML string
  const parametersXml = `
    <params>
      <user_id>${userId}</user_id>
      <status>${status}</status>
    </params>
  `;

  const args = {
    sid: sid,
    parameters: parametersXml,
  };

  try {
    const client = await soap.createClientAsync(WSDL_URL);
    client.on("request", (xml, eid) => {
      console.log("SOAP Request EID:", eid);
      console.log("Request XML:", xml);
    });
    const result = await client.getCoursesForUserAsync(args);
    return result[0].xml; // Returns the XML result set
  } catch (error) {
    console.error("SOAP Error:", error);
    throw error;
  }
}

// Alternative Funktion um ref_id für obj_id zu bekommen
export async function getRefIdFromObjId(sessionId: string, objId: string): Promise<string | null> {
  try {
    console.log(`Suche ref_id für obj_id ${objId}...`);
    
    const soap = await import('soap');
    const client = await soap.createClientAsync('https://elearning.hs-albsig.de/webservice/soap/server.php?wsdl');
    
    // Versuche über searchObjects zu suchen
    const searchResult = await client.searchObjectsAsync({
      sid: sessionId,
      query_parser: 'lucene',
      query: `obj_id:${objId}`,
      filter: {}
    });
    
    console.log('Suchergebnis für obj_id:', searchResult);
    
    if (searchResult && searchResult[0] && searchResult[0].objects_xml) {
      const xml = searchResult[0].objects_xml.$value || searchResult[0].objects_xml;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      
      const objects = doc.getElementsByTagName('Object');
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const currentObjId = obj.getAttribute('obj_id');
        if (currentObjId === objId) {
          const refId = obj.getAttribute('ref_id');
          console.log(`Gefundene ref_id für obj_id ${objId}: ${refId}`);
          return refId;
        }
      }
    }
    
    console.log(`Keine ref_id gefunden für obj_id ${objId}`);
    return null;
    
  } catch (error) {
    console.error('Fehler beim Abrufen der ref_id:', error);
    return null;
  }
}
async function getCoursesFromRoles(sid: string, userId: number, includeDetails = false) {
  try {
    // 1. Hole alle Rollen des Benutzers (das funktioniert bereits)
    const rolesResult = await getRolesForUser(sid, userId);
    
    // 2. Extrahiere Kursinformationen aus Rollen-XML
    const courseInfo = extractCourseInfoFromRoles(rolesResult);
    
    console.log("Extrahierte Kursinformationen:", courseInfo);
    
    // 3. Falls Details gewünscht, hole zusätzliche Kursinformationen
    if (includeDetails) {
      const detailedCourses = [];
      for (const course of courseInfo) {
        try {
          console.log(`Lade Details für Kurs ${course.obj_id}...`);
          const courseDetails = await getCourseDetails(sid, course.obj_id);
          detailedCourses.push({
            ...course,
            details: courseDetails
          });
        } catch (error) {
          console.warn(`Konnte Details für Kurs ${course.obj_id} nicht laden:`, error);
          detailedCourses.push({
            ...course,
            details: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      return detailedCourses;
    }
    
    return courseInfo;
  } catch (error) {
    console.error('Fehler beim Abrufen der Kurse aus Rollen:', error);
    throw error;
  }
}

// Vereinfachte Hilfsfunktion: Extrahiere Kursinformationen direkt aus Rollen
function extractCourseInfoFromRoles(rolesXml: any): Array<{obj_id: string, title: string, description: string, role_type: string}> {
  const courses: Array<{obj_id: string, title: string, description: string, role_type: string}> = [];
  
  try {
    // Das XML ist in rolesXml.$value oder rolesXml
    const xmlString = rolesXml.$value || rolesXml;
    
    if (typeof xmlString === 'string') {
      console.log("Parsing XML für Kursinformationen...");
      
      // Suche nach allen Kurs-Rollen (il_crs_*)
      const rolePattern = /<Object[^>]*type="role"[^>]*obj_id="(\d+)"[^>]*>[\s\S]*?<Title>(il_crs_(?:member|admin|tutor)_\d+)<\/Title>[\s\S]*?<Description>([^<]*)<\/Description>/g;
      
      let match;
      while ((match = rolePattern.exec(xmlString)) !== null) {
        const [fullMatch, objId, title, description] = match;
        
        // Extrahiere Kurs-ID aus der Beschreibung
        const courseObjMatch = description.match(/obj_no\.(\d+)/);
        
        if (courseObjMatch) {
          const courseObjId = courseObjMatch[1];
          
          // Bestimme Rolle
          let roleType = 'member';
          if (title.includes('_admin_')) roleType = 'admin';
          else if (title.includes('_tutor_')) roleType = 'tutor';
          
          courses.push({
            obj_id: courseObjId,
            title: title,
            description: description,
            role_type: roleType
          });
        }
      }
    }
  } catch (error) {
    console.error('Fehler beim Parsen der Rollen-XML:', error);
  }
  
  return courses;
}

// Hole detaillierte Kursinformationen über verschiedene API-Methoden
async function getCourseDetails(sid: string, courseObjId: string) {
  const details: any = {};
  
  try {
    // Methode 1: getCourseXML - Versuche XML-Details zu holen
    try {
      const soapClient = await soap.createClientAsync(WSDL_URL);
      soapClient.setEndpoint(ENDPOINT_URL);
      
      const result = await soapClient.getCourseXMLAsync({
        sid: sid,
        course_id: courseObjId
      });
      
      if (result && result[0] && result[0].xml) {
        details.courseXML = result[0].xml;
        details.source = 'getCourseXML';
        
        // Parse grundlegende Informationen aus XML
        const parsedInfo = parseCourseXML(result[0].xml);
        details.parsedInfo = parsedInfo;
      }
    } catch (xmlError) {
      console.warn(`getCourseXML fehlgeschlagen für ${courseObjId}:`, xmlError);
      details.xmlError = xmlError instanceof Error ? xmlError.message : 'Unknown error';
    }
    
    // Methode 2: getObjectByReference - Versuche allgemeine Objektinformationen
    try {
      const soapClient = await soap.createClientAsync(WSDL_URL);
      soapClient.setEndpoint(ENDPOINT_URL);
      
      const result = await soapClient.getObjectByReferenceAsync({
        sid: sid,
        reference_id: courseObjId,
        user_id: "" // Optional
      });
      
      if (result && result[0]) {
        details.objectInfo = result[0];
        details.source = details.source || 'getObjectByReference';
      }
    } catch (objError) {
      console.warn(`getObjectByReference fehlgeschlagen für ${courseObjId}:`, objError);
      details.objError = objError instanceof Error ? objError.message : 'Unknown error';
    }
    
  } catch (error) {
    details.generalError = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return details;
}

// Hilfsfunktion: Parse Kurs-XML für grundlegende Informationen
function parseCourseXML(xmlString: string) {
  const info: any = {};
  
  try {
    // Extrahiere Titel
    const titleMatch = xmlString.match(/<Title>([^<]+)<\/Title>/);
    if (titleMatch) {
      info.title = titleMatch[1];
    }
    
    // Extrahiere Beschreibung
    const descMatch = xmlString.match(/<Description>([^<]*)<\/Description>/);
    if (descMatch) {
      info.description = descMatch[1];
    }
    
    // Extrahiere Status
    const statusMatch = xmlString.match(/<Status>([^<]+)<\/Status>/);
    if (statusMatch) {
      info.status = statusMatch[1];
    }
    
    // Extrahiere Startdatum
    const startMatch = xmlString.match(/<Start>([^<]+)<\/Start>/);
    if (startMatch) {
      info.startDate = startMatch[1];
    }
    
    // Extrahiere Enddatum
    const endMatch = xmlString.match(/<End>([^<]+)<\/End>/);
    if (endMatch) {
      info.endDate = endMatch[1];
    }
    
  } catch (error) {
    console.error('Fehler beim Parsen von Kurs-XML:', error);
  }
  
  return info;
}

// Alternative Methode: getGroupsForUser - funktioniert möglicherweise besser
async function getGroupsForUser(
  sid: string,
  userId: number,
  status = 1 /* MEMBER only */
): Promise<string> {
  try {
    const soapClient = await soap.createClientAsync(WSDL_URL);
    soapClient.setEndpoint(ENDPOINT_URL);
    
    soapClient.on("request", (xml, eid) => {
      console.log("SOAP Request EID:", eid);
      console.log("Request XML:", xml);
    });

    const parametersXml = `<params><user_id>${userId}</user_id><status>${status}</status></params>`;

    const result = await soapClient.getGroupsForUserAsync({
      sid: sid,
      parameters: parametersXml
    });
    
    console.log("SOAP Response:", result);
    return result[0].xml;
  } catch (error) {
    console.error("SOAP Error:", error);
    throw error;
  }
}

// Hole Kursmaterialien und lade sie ins lokale Verzeichnis
export async function downloadCourseMaterials(
  sid: string, 
  courseObjId: string, 
  downloadPath: string = './downloads/courses'
) {
  try {
    console.log(`Lade Materialien für Kurs ${courseObjId}...`);
    
    // 1. Erstelle Download-Verzeichnis
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const coursePath = path.join(downloadPath, `course_${courseObjId}`);
    await fs.mkdir(coursePath, { recursive: true });
    
    const materials = [];
    
    // 2. Hole Kurs-Strukturinformationen (Ordner/Dateien)
    try {
      const treeObjects = await getCourseTreeObjects(sid, courseObjId);
      materials.push(...treeObjects);
    } catch (error) {
      console.warn(`Konnte Kurs-Struktur nicht laden:`, error);
    }
    
    // 3. Lade alle gefundenen Dateien herunter
    const downloadedFiles = [];
    for (const material of materials) {
      try {
        if (material.type === 'file') {
          const downloadedFile = await downloadFile(sid, material.ref_id, coursePath, material.title);
          downloadedFiles.push(downloadedFile);
        } else if (material.type === 'fold') {
          // Für Ordner: Erstelle lokalen Ordner und lade Inhalte
          const folderPath = path.join(coursePath, sanitizeFilename(material.title));
          await fs.mkdir(folderPath, { recursive: true });
          
          // Hole Ordner-Inhalte
          try {
            const folderContents = await getFolderContents(sid, material.ref_id);
            for (const item of folderContents) {
              if (item.type === 'file') {
                const downloadedFile = await downloadFile(sid, item.ref_id, folderPath, item.title);
                downloadedFiles.push(downloadedFile);
              }
            }
          } catch (folderError) {
            console.warn(`Konnte Ordner ${material.title} nicht durchsuchen:`, folderError);
          }
        }
      } catch (error) {
        console.error(`Fehler beim Download von ${material.title}:`, error);
      }
    }
    
    // 4. Erstelle Übersichtsdatei
    const summary = {
      courseId: courseObjId,
      downloadDate: new Date().toISOString(),
      totalMaterials: materials.length,
      downloadedFilesCount: downloadedFiles.length,
      materials: materials,
      downloadedFiles: downloadedFiles,
      downloadPath: coursePath
    };
    
    await fs.writeFile(
      path.join(coursePath, 'download_summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log(`Download abgeschlossen: ${downloadedFiles.length} Dateien in ${coursePath}`);
    return summary;
    
  } catch (error) {
    console.error('Fehler beim Download der Kursmaterialien:', error);
    throw error;
  }
}

// Hole Kurs-Struktur (Ordner, Dateien, etc.)
async function getCourseTreeObjects(sid: string, courseObjId: string) {
  try {
    const soapClient = await soap.createClientAsync(WSDL_URL);
    soapClient.setEndpoint(ENDPOINT_URL);
    
    // Hole alle Kinderobjekte des Kurses
    const result = await soapClient.getTreeChildsAsync({
      sid: sid,
      ref_id: courseObjId,
      types: ['file', 'fold', 'lm', 'webr'] // Dateien, Ordner, Lernmodule, Weblinks
    });
    
    console.log('Kurs-Struktur Antwort:', result);
    
    if (result && result[0] && result[0].xml) {
      return parseTreeObjectsXML(result[0].xml);
    }
    
    return [];
  } catch (error) {
    console.error('Fehler beim Abrufen der Kurs-Struktur:', error);
    throw error;
  }
}

// Hole Ordner-Inhalte
async function getFolderContents(sid: string, folderRefId: string) {
  try {
    const soapClient = await soap.createClientAsync(WSDL_URL);
    soapClient.setEndpoint(ENDPOINT_URL);
    
    const result = await soapClient.getTreeChildsAsync({
      sid: sid,
      ref_id: folderRefId,
      types: ['file', 'fold']
    });
    
    if (result && result[0] && result[0].xml) {
      return parseTreeObjectsXML(result[0].xml);
    }
    
    return [];
  } catch (error) {
    console.error('Fehler beim Abrufen des Ordner-Inhalts:', error);
    return [];
  }
}

// Lade eine einzelne Datei herunter
async function downloadFile(sid: string, fileRefId: string, downloadPath: string, fileName: string) {
  try {
    const soapClient = await soap.createClientAsync(WSDL_URL);
    soapClient.setEndpoint(ENDPOINT_URL);
    
    // Hole Datei-XML mit Inhalt
    const result = await soapClient.getFileXMLAsync({
      sid: sid,
      ref_id: fileRefId,
      attachment_mode: 1 // 1 = base64 encoded content
    });
    
    if (result && result[0] && result[0].xml) {
      const fileInfo = parseFileXML(result[0].xml);
      
      if (fileInfo.content) {
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // Dekodiere base64 Inhalt
        const fileBuffer = Buffer.from(fileInfo.content, 'base64');
        
        // Sichere Dateinamen
        const safeFileName = sanitizeFilename(fileInfo.title || fileName);
        const filePath = path.join(downloadPath, safeFileName);
        
        // Schreibe Datei
        await fs.writeFile(filePath, fileBuffer);
        
        console.log(`Datei gespeichert: ${filePath}`);
        
        return {
          refId: fileRefId,
          title: fileInfo.title,
          fileName: safeFileName,
          filePath: filePath,
          size: fileBuffer.length,
          type: fileInfo.type || 'unknown'
        };
      }
    }
    
    throw new Error('Keine Dateiinhalte erhalten');
    
  } catch (error) {
    console.error(`Fehler beim Download der Datei ${fileName}:`, error);
    throw error;
  }
}

// Parse Tree Objects XML
function parseTreeObjectsXML(xmlString: string): Array<{ref_id: string, type: string, obj_id: string, title: string, description?: string}> {
  const objects: Array<{ref_id: string, type: string, obj_id: string, title: string, description?: string}> = [];
  
  try {
    // Einfacher XML-Parser für Objekte
    const objectMatches = xmlString.match(/<Object[^>]*>[\s\S]*?<\/Object>/g);
    
    if (objectMatches) {
      objectMatches.forEach(objectXml => {
        const obj: any = {};
        
        // Extrahiere Attribute
        const refIdMatch = objectXml.match(/ref_id="([^"]+)"/);
        const typeMatch = objectXml.match(/type="([^"]+)"/);
        const objIdMatch = objectXml.match(/obj_id="([^"]+)"/);
        
        if (refIdMatch) obj.ref_id = refIdMatch[1];
        if (typeMatch) obj.type = typeMatch[1];
        if (objIdMatch) obj.obj_id = objIdMatch[1];
        
        // Extrahiere Titel
        const titleMatch = objectXml.match(/<Title>([^<]*)<\/Title>/);
        if (titleMatch) obj.title = titleMatch[1];
        
        // Extrahiere Beschreibung
        const descMatch = objectXml.match(/<Description>([^<]*)<\/Description>/);
        if (descMatch) obj.description = descMatch[1];
        
        objects.push(obj);
      });
    }
  } catch (error) {
    console.error('Fehler beim Parsen der Tree Objects XML:', error);
  }
  
  return objects;
}

// Parse File XML
function parseFileXML(xmlString: string) {
  const fileInfo: any = {};
  
  try {
    // Extrahiere Dateiinformationen
    const titleMatch = xmlString.match(/<Title>([^<]*)<\/Title>/);
    if (titleMatch) fileInfo.title = titleMatch[1];
    
    const typeMatch = xmlString.match(/<FileType>([^<]*)<\/FileType>/);
    if (typeMatch) fileInfo.type = typeMatch[1];
    
    const sizeMatch = xmlString.match(/<FileSize>([^<]*)<\/FileSize>/);
    if (sizeMatch) fileInfo.size = parseInt(sizeMatch[1]);
    
    // Extrahiere base64-kodierten Inhalt
    const contentMatch = xmlString.match(/<Content>([^<]*)<\/Content>/);
    if (contentMatch) fileInfo.content = contentMatch[1];
    
  } catch (error) {
    console.error('Fehler beim Parsen der File XML:', error);
  }
  
  return fileInfo;
}

// Hilfsfunktion: Sichere Dateinamen
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')  // Ersetze ungültige Zeichen
    .replace(/\s+/g, '_')          // Ersetze Leerzeichen
    .substring(0, 255);            // Begrenze Länge
}

export { 
  loginToIlias, 
  getUserIdBySid, 
  getCoursesForUser, 
  getRolesForUser, 
  getCoursesFromRoles, 
  getCourseDetails, 
  getGroupsForUser
};
