import soap from "soap";

const url = "https://elearning.hs-albsig.de/ilias/webservice/soap?wsdl";

// Für die ILIAS SOAP API, wenn wir Zugriff bekommen sollten, bzw. wenn Soap API verfügbar ist
async function getIliasClient(methodName: string, args: any = {}) {
  const client = await soap.createClientAsync(url, {
    // Optional: HTTP Basic Auth, falls so konfiguriert
    wsdl_headers: {
      Authorization: "Basic " + Buffer.from("").toString("base64"),
    },
  });
  const [result] = await client[`${methodName}Async`](args);

  return result;
}
