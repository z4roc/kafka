import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1>404 - Seite nicht gefunden</h1>
      <p>Hoppla! Die Seite, die Sie suchen, existiert leider nicht.</p>
      <Image
        src="/kurukuru.gif"
        alt="404 Illustration"
        width={300}
        height={200}
        style={{ marginTop: "20px" }}
      />
      <Link
        href="/"
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          color: "white",
          backgroundColor: "#0070f3",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
