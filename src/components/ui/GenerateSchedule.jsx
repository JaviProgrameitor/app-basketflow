
import React, { Fragment } from "react";
import DraftRoundCard from "./DraftRoundCard.jsx";

const GenerateSchedule = ({
  setTab = () => { },
  loading = false,
  teams = [],
  handleGenerate = () => { },
  saveAllDraft = () => { },
  schedule = [],
  saveSingleDraft = () => { },
  updateMatchDraft = () => { },
  saveSingleRoundDraft = () => { },
}) => {
  // UI helpers
  const primaryBtn =
    "button inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50";
  const secondaryBtn =
    "button inline-flex items-center px-3 py-1.5 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50";
  const card = "bg-white shadow rounded-lg border border-gray-100";
  return (
    <Fragment>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className={primaryBtn}
          onClick={() => setTab("generate")}
        >
          Generar
        </button>
        <button
          className={secondaryBtn}
          onClick={() => setTab("template")}
        >
          Plantilla guardada
        </button>
        <div className="flex-1"></div>
        <button className={secondaryBtn} onClick={handleGenerate} disabled={loading || teams.length < 2}>
          Generar calendario
        </button>
        <button
          className={primaryBtn}
          onClick={saveAllDraft}
          disabled={loading || (schedule || []).length === 0}
        >
          Guardar todos
        </button>
      </div>

      {/* Content */}
      {(schedule || []).length === 0 ? (
          <div className={`${card} p-6`}>
            <h3 className="text-lg font-semibold text-gray-800">
              Genera tu calendario
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Usa el generador de Round Robin para crear el calendario. No se asignarán
              fechas, horas ni sedes automáticamente; podrás completarlas aquí antes
              de guardarlo como plantilla.
            </p>
            <div className="mt-4">
              <button
                className={primaryBtn}
                onClick={handleGenerate}
                disabled={teams.length < 2}
              >
                Generar calendario
              </button>
              {teams.length < 2 && (
                <p className="text-xs text-red-600 mt-2">
                  Agrega al menos 2 equipos al torneo para generar el calendario.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {schedule.map((round, idx) => (
              <DraftRoundCard
                key={idx}
                round={round}
                roundIdx={idx}
                saveSingleDraft={saveSingleDraft}
                updateMatchDraft={updateMatchDraft}
                saveSingleRoundDraft={saveSingleRoundDraft}
              />
            ))}
          </div>
        )
      }
    </Fragment>
  );
};

export default GenerateSchedule;