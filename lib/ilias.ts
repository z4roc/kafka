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
    return result[0].$value; // Angenommen, die Rollen sind im 'roles'-Feld
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
  // 1) create & configure client
  const client = await soap.createClientAsync(WSDL_URL, {});
  client.setEndpoint(ENDPOINT_URL);

  // reuse your BasicAuth or token-based security if needed…
  // client.setSecurity(new soap.BasicAuthSecurity(wsUser, wsPass));
  client.addHttpHeader("SOAPAction", `"${NAMESPACE}#getCoursesForUser"`);
  // 2) Build the RPC-encoded parameters XML
  // ILIAS wants a flat "parameters" string containing columns "user_id" and "status"
  // One common pattern is to send a little XML snippet:
  let parameters = `user_id=${userId};status=${status}`;
  parameters.trim();
  parameters = "";

  client.on("request", (xml, eid) => {
    console.log("SOAP Request EID:", eid);
    console.log("Request XML:", xml);
  });
  client.addHttpHeader("SOAPAction", `"${NAMESPACE}#getCoursesForUser"`);
  // 3) Call the method
  // RPC/encoded calls take a single object with named parts, just like login
  const response = await client.getCoursesForUserAsync({
    sid,
    parameters,
  });

  // 4) response.xml is a flat string containing an XMLResultSet.
  // You can parse it or hand it off to your XML parser.
  return response.xml as string;
}

export { loginToIlias, getUserIdBySid, getCoursesForUser, getRolesForUser };
