import axios from "axios";
import * as soap from "soap";
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

// Alternative Methode: Kursinformationen aus Rollen extrahieren (mit Details)
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

export { 
  loginToIlias, 
  getUserIdBySid, 
  getCoursesForUser, 
  getRolesForUser, 
  getCoursesFromRoles, 
  getCourseDetails, 
  getGroupsForUser 
};
