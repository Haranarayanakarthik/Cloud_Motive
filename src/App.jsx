import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./App.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function App() {
  const [highlight, setHighlight] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [showExtracted, setShowExtracted] = useState(false);

  // Extract text from PDF page
  const handleExtractText = async () => {
    const loadingTask = pdfjs.getDocument("/Maersk_Q2_2025.pdf");
    const pdf = await loadingTask.promise;

    const page = await pdf.getPage(15);
    const content = await page.getTextContent();

    const strings = content.items.map((item) => item.str).join(" ");
    setExtractedText(strings);
    setShowExtracted(true);
  };

  return (
    <div className="app-container">
      {/* LEFT SIDE - PDF VIEWER */}
      <div className="pdf-section">
        <Document file="/Maersk_Q2_2025.pdf">
          <Page
            pageNumber={15}
            customTextRenderer={({ str }) => {
              if (
                highlight &&
                str.includes("Gain on sale of non-current assets")
              ) {
                return <span style={{ backgroundColor: "yellow" }}>{str}</span>;
              }
              return str;
            }}
          />
        </Document>
      </div>

      {/* RIGHT SIDE - TEXT PANEL */}
      <div className="analysis-section">
        {!showExtracted ? (
          <>
            <h2>Click to load text from PDF</h2>
            <button className="highlight-btn" onClick={handleExtractText}>
              Extract Text from PDF
            </button>
          </>
        ) : (
          <>
            <h2>Extracted Text From PDF</h2>
            <p>{extractedText}</p>

            <button
              className="highlight-btn"
              onClick={() => setHighlight(true)}
            >
              Highlight in PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}
