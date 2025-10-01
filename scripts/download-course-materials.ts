import { 
  loginToIlias, 
  getUserIdBySid, 
  getCoursesFromRoles, 
  downloadCourseMaterials 
} from '../lib/ilias';

// Beispiel-Skript zum Herunterladen von Kursmaterialien
async function downloadAllCourseMaterials() {
  try {
    console.log('🔐 Anmeldung bei ILIAS...');
    
    // 1. Bei ILIAS anmelden
    const sessionId = await loginToIlias({
      client: "HS-Albsig",
      username: process.env.ILIAS_USERNAME || "",
      password: process.env.ILIAS_PASSWORD || ""
    });
    
    // 2. Benutzer-ID abrufen
    const userId = await getUserIdBySid(sessionId);
    console.log(`👤 Benutzer-ID: ${userId}`);
    
    // 3. Alle Kurse abrufen
    console.log('📚 Lade Kursliste...');
    const courses = await getCoursesFromRoles(sessionId, userId, false);
    console.log(`Gefunden: ${courses.length} Kurse`);
    
    // 4. Materialien für jeden Kurs herunterladen
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      console.log(`\n📥 [${i + 1}/${courses.length}] Lade Materialien für Kurs: ${course.title}`);
      
      try {
        const summary = await downloadCourseMaterials(
          sessionId,
          course.obj_id,
          `./downloads/all_courses`
        );
        
        console.log(`✅ Erfolgreich: ${summary.downloadedFilesCount} Dateien heruntergeladen`);
        console.log(`📁 Pfad: ${summary.downloadPath}`);
        
      } catch (error) {
        console.error(`❌ Fehler bei Kurs ${course.title}:`, error instanceof Error ? error.message : String(error));
      }
    }
    
    console.log('\n🎉 Download aller Kursmaterialien abgeschlossen!');
    
  } catch (error) {
    console.error('❌ Allgemeiner Fehler:', error);
  }
}

// Beispiel für einen einzelnen Kurs
async function downloadSingleCourse(courseId: string) {
  try {
    console.log(`📥 Lade Materialien für Kurs ${courseId}...`);
    
    const sessionId = await loginToIlias({
      client: "HS-Albsig", 
      username: process.env.ILIAS_USERNAME || "",
      password: process.env.ILIAS_PASSWORD || ""
    });
    
    const summary = await downloadCourseMaterials(
      sessionId,
      courseId,
      `./downloads/single_course`
    );
    
    console.log('✅ Download abgeschlossen:', summary);
    return summary;
    
  } catch (error) {
    console.error('❌ Download-Fehler:', error);
    throw error;
  }
}

// Exportiere Funktionen für externe Verwendung
export { downloadAllCourseMaterials, downloadSingleCourse };

// Für direkten Aufruf via Node.js
if (require.main === module) {
  // Überprüfe Kommandozeilenargumente
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] === 'single' && args[1]) {
    // Download eines einzelnen Kurses: node download-example.js single COURSE_ID
    downloadSingleCourse(args[1]);
  } else {
    // Download aller Kurse: node download-example.js
    downloadAllCourseMaterials();
  }
}