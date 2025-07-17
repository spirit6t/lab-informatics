import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function LabInformaticsCurriculum() {
  const initialTopics = [
    {
      id: "topic1",
      title: "1. Informatics in Pathology Practice",
      subtopics: [
        "Distinction between informatics and IT",
        "Data literacy and EMR interaction",
        "Pathology vs Clinical Informatics",
        "Basic computer hardware/software"
      ],
      resources: [
        {
          name: "Harrison, J. Session 0: Pathology Informatics and Data. Association for Pathology Informatics.",
          url: "https://www.pathologyinformatics.org/teaching-slide-sets"
        },
        {
          name: "Harrison, J. Session 1: Computer Hardware, Software, and Networking.Association for Pathology Informatics.",
          url: "https://www.pathologyinformatics.org/teaching-slide-sets"
        },
        {
          name: "Pantanowitz L, Tuthill JM, Balis UGJ, eds. Chapter 1: Pathology Informatics: An Introduction. In: Pantanowitz L, Tuthill JM, Balis UGJ, eds. Pathology Informatics: Theory and Practice. ASCP Press; 2012: 1-8."
        },
        {
          name: "Henricks WH, Wilkerson ML, Castellani WJ, Whitsitt MS, Sinard JH. Pathologists as stewards of laboratory information.Arch Pathol Lab Med. 2015; 139(3): 332- 337.",
          url: https://meridian.allenpress.com/aplm/article/139/3/332/193666/Pathologists-as-Stewards-of-Laboratory-Information"
        },
        {
          name: "Harrison, JH. Management of pathology information systems. In: Laboratory Administration for Pathologists, 2nd Ed.Wagar EA, Cohen MB, Karcher DS, Siegel GP, Eds.CAP Press; 2019: 93 - 94. "
        }
      ],

      resident: "",
      presentationDate: "",
      projectDeadline: "",
      expanded: false
    },
    {
      id: "topic2",
      title: "2. Data Science",
      subtopics: [
        "Data structure, quality, and flow",
        "Descriptive/Inferential Statistics",
        "Big Data in Pathology",
        "Artificial Intelligence and Machine Learning"
      ],
      resources: [
        "Machine Learning - API Slide Set",
        "Statistics for Pathologists (Demos Medical)",
        "Mod Pathol articles on AI/ML and ethics",
        "Generative AI in Pathology"
      ],
      resident: "",
      presentationDate: "",
      projectDeadline: "",
      expanded: false
    },
    {
      id: "topic3",
      title: "3. Data Availability and Security",
      subtopics: [
        "Data security and cyber threats",
        "HIPAA and PHI regulations",
        "Health IT system reliability",
        "De-identification and data use"
      ],
      resources: [
        "Cybersecurity - API Slide Set",
        "HIPAA.gov Professional Guidance",
        "HIMSS Cybersecurity Resources",
        "AHRQ High Reliability Primer"
      ],
      resident: "",
      presentationDate: "",
      projectDeadline: "",
      expanded: false
    },
    {
      id: "topic4",
      title: "4. LIS Components and Functions",
      subtopics: [
        "LIS core elements (dictionaries, audit trails, etc.)",
        "Order facilitation and test routing",
        "Autoverification and reflex rules",
        "Barcode tracking and specimen routing",
        "LIS for quality and error tracking"
      ],
      resources: [
        "Databases - API Slide Set",
        "LIS and Health Information Systems - API Slide Set",
        "CAP LIS Fundamentals",
        "Patient and Sample Identification (J Med Biochem)"
      ],
      resident: "",
      presentationDate: "",
      projectDeadline: "",
      expanded: false
    },
    {
      id: "topic5",
      title: "5. Messaging Standards and Interfaces",
      subtopics: [
        "Standards development and HL7",
        "Terminologies: SNOMED, LOINC, ICD",
        "Middleware definitions and usage",
        "Data-driven decision making (DDDM)"
      ],
      resources: [
        "Interoperability and Interfaces - API Slide Set",
        "DICOM Whole Slide Imaging",
        "CDC ICD-10 Tool",
        "CAP Integration & Interface Guidelines"
      ],
      resident: "",
      presentationDate: "",
      projectDeadline: "",
      expanded: false
    },
    {
      id: "topic6",
      title: "6. Clinical Decision Support",
      subtopics: [
        "CDS architecture and 5 rights",
        "CDS categories: ordering, education, diagnostics",
        "Limitations: alert fatigue, bias",
        "CDS evaluation methods"
      ],
      resources: [
        "Clinical Decision Support - API Slide Set",
        "10 Commandments for CDS (JAMIA)",
        "SAFER Self-Assessment Tool (ONC)",
        "Systematic review on CDS in Lab Medicine"
      ],
      resident: "",
      presentationDate: "",
      projectDeadline: "",
      expanded: false
    },
    {
      id: "topic7",
      title: "7. Digital Pathology Systems",
      subtopics: [
        "Types and uses of digital pathology (WSI, telepathology)",
        "Image formats and compression",
        "Image analysis and AI in pathology",
        "Validation and CAP regulatory guidelines"
      ],
      resources: [
        "Digital Imaging - API Slide Set",
        "Digital Pathology applications (Mod Pathol)",
        "Validation of WSI (CAP guideline)",
        "Lancet Oncology AI in Digital Pathology"
      ],
      resident: "",
      presentationDate: "",
      projectDeadline: "",
      expanded: false
    },
    {
      id: "topic8",
      title: "8. Pathologist Role in LIS and EHR Projects",
      subtopics: [
        "Test ordering and result display roles",
        "Test build and validation",
        "New LIS evaluation and implementation",
        "Regulatory & accreditation responsibilities"
      ],
      resources: [
        "System Implementation - API Slide Set",
        "Pathologists in the EHR Landscape (APLM)",
        "CLSI Autoverification & Instrumentation",
        "CAP LIS Change Control & QA Checklist"
      ],
      resident: "",
      presentationDate: "",
      projectDeadline: "",
      expanded: false
    }
  ];
  const [topics, setTopics] = useState(initialTopics);
  useEffect(() => {
    const stored = localStorage.getItem("informaticsTopics");
    if (stored) {
      setTopics(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("informaticsTopics", JSON.stringify(topics));
  }, [topics]);

  const handleChange = (index, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index][field] = value;
    setTopics(updatedTopics);
  };

  const toggleExpand = (index) => {
    const updatedTopics = [...topics];
    updatedTopics[index].expanded = !updatedTopics[index].expanded;
    setTopics(updatedTopics);
  };

  const exportToExcel = () => {
    const exportData = topics.map(({ title, resident, presentationDate, projectDeadline }) => ({
      Title: title,
      Resident: resident,
      "Presentation Date": presentationDate,
      "Project Deadline": projectDeadline
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curriculum");
    XLSX.writeFile(workbook, "Lab_Informatics_Curriculum.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lab Informatics Curriculum for Pathology Residents</h1>
      <button
        onClick={exportToExcel}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Export to Excel
      </button>
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div key={topic.id} className="bg-white rounded-xl shadow">
            <button
              className="w-full text-left px-6 py-4 font-semibold text-lg hover:bg-gray-50 focus:outline-none"
              onClick={() => toggleExpand(index)}
            >
              {topic.title}
            </button>
            {topic.expanded && (
              <div className="px-6 pb-4">
                <h3 className="font-semibold mt-2">Subtopics:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {topic.subtopics.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>

                <h3 className="font-semibold mt-2">Resources:</h3>
                <ul className="list-disc list-inside text-sm text-blue-700">
                  {topic.resources.map((res, i) => (
                    <li key={i}>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-700 hover:text-blue-900"
                      >
                        {res.name}
                      </a>
                    </li>
                  ))}

                </ul>

                <div className="mt-4">
                  <label className="block text-sm font-medium">Resident Name:</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    value={topic.resident}
                    onChange={(e) => handleChange(index, "resident", e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium">Project Deadline:</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    value={topic.projectDeadline}
                    onChange={(e) => handleChange(index, "projectDeadline", e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium">Date of Presentation:</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    value={topic.presentationDate}
                    onChange={(e) => handleChange(index, "presentationDate", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
