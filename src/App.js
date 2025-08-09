// App.js — Admin-Only Mode with Multi-Subtopic Assignments + Coverage Summary

import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import logo from "./logo.png";

export default function LabInformaticsCurriculum() {
  // ---- Seed data (you can add more topics later) ----
  const initialTopics = [
    {
      id: "topic1",
      title: "1. Informatics in Pathology Practice",
      subtopics: [
        "Distinction between informatics and IT",
        "Data literacy and EMR interaction",
        "Pathology vs Clinical Informatics",
        "Basic computer hardware/software",
      ],
      resources: [
        {
          name:
            "Harrison, J. Session 0: Pathology Informatics and Data. Association for Pathology Informatics.",
          url: "https://www.pathologyinformatics.org/teaching-slide-sets",
        },
        {
          name:
            "Harrison, J. Session 1: Computer Hardware, Software, and Networking. Association for Pathology Informatics.",
          url: "https://www.pathologyinformatics.org/teaching-slide-sets",
        },
        {
          name:
            "Henricks WH, et al. Pathologists as stewards of laboratory information.",
          url:
            "https://meridian.allenpress.com/aplm/article/139/3/332/193666/Pathologists-as-Stewards-of-Laboratory-Information",
        },
      ],
      residents: [],
      expanded: false,
    },
  ];

  // ---- State ----
  const [topics, setTopics] = useState(initialTopics);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // ---- Load persisted state & migrate any older resident shape ----
  useEffect(() => {
    const storedTopics = localStorage.getItem("informaticsTopics");
    if (storedTopics) {
      const parsed = JSON.parse(storedTopics).map((t) => ({
        ...t,
        residents: Array.isArray(t.residents)
          ? t.residents.map((r) => ({
            name: r?.name || "",
            // migrate single string 'subtopic' -> array 'subtopics'
            subtopics: Array.isArray(r?.subtopics)
              ? r.subtopics
              : r?.subtopic
                ? [r.subtopic]
                : [],
            dueDate: r?.dueDate || "",
          }))
          : [],
        expanded: !!t.expanded,
      }));
      setTopics(parsed);
    }

    const storedAdmin = localStorage.getItem("isAdmin");
    if (storedAdmin === "true") setIsAdmin(true);
  }, []);

  // ---- Persist topics/admin ----
  useEffect(() => {
    localStorage.setItem("informaticsTopics", JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem("isAdmin", String(isAdmin));
  }, [isAdmin]);

  // ---- Topic controls ----
  const toggleExpand = (index) => {
    setTopics((prev) =>
      prev.map((t, i) => (i === index ? { ...t, expanded: !t.expanded } : t))
    );
  };

  // ---- Resident controls ----
  const addResident = (topicIndex) => {
    setTopics((prev) =>
      prev.map((t, i) =>
        i === topicIndex
          ? {
            ...t,
            residents: [
              ...t.residents,
              { name: "", subtopics: [], dueDate: "" },
            ],
          }
          : t
      )
    );
  };

  const removeResident = (topicIndex, residentIndex) => {
    setTopics((prev) =>
      prev.map((t, i) =>
        i === topicIndex
          ? {
            ...t,
            residents: t.residents.filter((_, r) => r !== residentIndex),
          }
          : t
      )
    );
  };

  const updateResidentField = (topicIndex, residentIndex, field, value) => {
    setTopics((prev) =>
      prev.map((t, i) =>
        i === topicIndex
          ? {
            ...t,
            residents: t.residents.map((r, j) =>
              j === residentIndex ? { ...r, [field]: value } : r
            ),
          }
          : t
      )
    );
  };

  const toggleResidentSubtopic = (topicIndex, residentIndex, sub) => {
    setTopics((prev) =>
      prev.map((t, i) => {
        if (i !== topicIndex) return t;
        const nextResidents = t.residents.map((r, j) => {
          if (j !== residentIndex) return r;
          const has = (r.subtopics || []).includes(sub);
          return {
            ...r,
            subtopics: has
              ? r.subtopics.filter((s) => s !== sub)
              : [...(r.subtopics || []), sub],
          };
        });
        return { ...t, residents: nextResidents };
      })
    );
  };

  // ---- Export: one row per (resident, subtopic) ----
  const exportToExcel = () => {
    const exportRows = topics.flatMap(({ title, residents }) =>
      (residents || []).flatMap((r) => {
        const subs =
          Array.isArray(r.subtopics) && r.subtopics.length ? r.subtopics : [""];
        return subs.map((st) => ({
          Title: title,
          Resident: r.name || "",
          Subtopic: st,
          "Due Date": r.dueDate || "",
        }));
      })
    );

    if (!exportRows.length) {
      alert("No assignments to export yet.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curriculum");
    XLSX.writeFile(workbook, "Lab_Informatics_Curriculum.xlsx");
  };

  // ---- Admin Login ----
  const handleLogin = () => {
    if (adminPassword === "admin123") {
      setIsAdmin(true);
      setAdminPassword("");
    } else {
      alert("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminPassword("");
    localStorage.setItem("isAdmin", "false");
  };

  // ---- Resident Coverage Summary (derived) ----
  const residentCoverage = useMemo(() => {
    const map = new Map(); // name -> [{ topic, subtopic, dueDate }]
    topics.forEach((t) => {
      (t.residents || []).forEach((r) => {
        const name = (r.name || "").trim();
        if (!name) return;
        const list = map.get(name) || [];
        const subs =
          Array.isArray(r.subtopics) && r.subtopics.length ? r.subtopics : [""];
        subs.forEach((st) =>
          list.push({ topic: t.title, subtopic: st, dueDate: r.dueDate || "" })
        );
        map.set(name, list);
      });
    });
    return Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [topics]);

  // ---- UI ----
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with logo */}
      <div className="flex items-center mb-6">
        <img src={logo} alt="Lab Curriculum Logo" className="h-12 w-12 mr-4" />
        <h1 className="text-3xl font-bold">
          Lab Informatics Curriculum for Pathology Residents
        </h1>
      </div>

      {/* Admin login */}
      {!isAdmin && (
        <div className="mb-6">
          <label className="block text-sm font-medium">Admin Password:</label>
          <input
            type="password"
            className="mt-1 block w-full max-w-sm border border-gray-300 rounded p-2"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleLogin}
          >
            Login as Admin
          </button>
        </div>
      )}

      {/* Admin actions */}
      {isAdmin && (
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={exportToExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export to Excel
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* Topics */}
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div key={topic.id} className="bg-white rounded-xl shadow">
            <button
              className="w-full text-left px-6 py-4 font-semibold text-lg hover:bg-gray-50"
              onClick={() => toggleExpand(index)}
            >
              {topic.title}
            </button>

            {topic.expanded && (
              <div className="px-6 pb-4">
                {/* Subtopics */}
                <h3 className="font-semibold mt-2">Subtopics:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {topic.subtopics.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>

                {/* Resources */}
                <h3 className="font-semibold mt-2">Resources:</h3>
                <ul className="list-disc list-inside text-sm text-blue-700">
                  {topic.resources.map((res, i) => (
                    <li key={i}>
                      {res.url ? (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-700 hover:text-blue-900"
                        >
                          {res.name}
                        </a>
                      ) : (
                        <span>{res.name}</span>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Residents */}
                <h3 className="font-semibold mt-4">Resident Assignments:</h3>
                {isAdmin && (
                  <button
                    onClick={() => addResident(index)}
                    className="mb-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    + Add Resident
                  </button>
                )}

                {topic.residents.map((resident, rIndex) => (
                  <div key={rIndex} className="mb-4 border-t pt-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium">
                        Resident #{rIndex + 1} Name:
                      </label>
                      {isAdmin && (
                        <button
                          onClick={() => removeResident(index, rIndex)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Name */}
                    {isAdmin ? (
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        value={resident.name}
                        onChange={(e) =>
                          updateResidentField(
                            index,
                            rIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <p className="mt-1 text-gray-800">{resident.name}</p>
                    )}

                    {/* Multi-subtopic selection */}
                    <label className="block text-sm font-medium mt-2">
                      Assigned Subtopics:
                    </label>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topic.subtopics.map((sub, i) => (
                        <label
                          key={i}
                          className="inline-flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            disabled={!isAdmin}
                            checked={
                              Array.isArray(resident.subtopics) &&
                              resident.subtopics.includes(sub)
                            }
                            onChange={() =>
                              toggleResidentSubtopic(index, rIndex, sub)
                            }
                          />
                          <span>{sub}</span>
                        </label>
                      ))}
                    </div>

                    {/* Due Date */}
                    <label className="block text-sm font-medium mt-2">
                      Due Date:
                    </label>
                    {isAdmin ? (
                      <input
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        value={resident.dueDate}
                        onChange={(e) =>
                          updateResidentField(
                            index,
                            rIndex,
                            "dueDate",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <p className="mt-1 text-gray-800">{resident.dueDate}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resident Coverage Summary */}
      <div className="mt-8 bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">
          Resident Coverage Summary
        </h2>
        {residentCoverage.length === 0 ? (
          <p className="text-sm text-gray-600">No assignments yet.</p>
        ) : (
          <div className="space-y-4">
            {residentCoverage.map(([residentName, items]) => (
              <div key={residentName}>
                <h3 className="font-medium">{residentName}</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {items.map((it, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{it.topic}</span>
                      {it.subtopic ? ` — ${it.subtopic}` : ""}
                      {it.dueDate ? ` (due ${it.dueDate})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
