
import React, { Fragment } from "react";
import SavedRoundCard from "./SavedRoundCard.jsx";

const ManageSavedSchedule = ({
  setTab = () => { },
  loading = false,
  deleteAllGenerated = () => { },
  deleteSavedMatch = () => { },
  fetchGeneratedMatches = () => { },
  savedSchedule = [],
  publishSavedMatch = () => { },
  updateSavedMatch = () => { },
}) => {
  // UI helpers
  const primaryBtn =
    "button inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50";
  const secondaryBtn =
    "button inline-flex items-center px-3 py-1.5 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50";
  const dangerBtn =
    "button inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50";
  const subtleBtn =
    "button inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50";
  const card = "bg-white shadow rounded-lg border border-gray-100";

  return (
    <Fragment>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className={secondaryBtn}
          onClick={() => setTab("generate")}
        >
          Generar
        </button>
        <button
          className={primaryBtn}
          onClick={() => setTab("template")}
        >
          Plantilla guardada
        </button>
        <div className="flex-1"></div>
        <button
          className={dangerBtn}
          onClick={deleteAllGenerated}
          disabled={loading || (savedSchedule || []).flat().length === 0}
        >
          Vaciar plantilla
        </button>
        <button
          className={subtleBtn}
          onClick={fetchGeneratedMatches}
          disabled={loading}
        >
          Refrescar
        </button>
      </div>

      {/* Content */}
      {(savedSchedule || []).filter(Boolean).length === 0 ? (
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-semibold text-gray-800">Sin plantilla guardada</h3>
          <p className="text-sm text-gray-600 mt-2">
            Genera y guarda el calendario para verlo aquí. Desde esta vista
            podrás editar fechas, horarios y sedes; publicar partidos a la liga
            o eliminarlos.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedSchedule.map((round, idx) =>
            (round || []).length && (
              <SavedRoundCard
                key={idx}
                round={round}
                roundIdx={idx}
                updateSavedMatch={updateSavedMatch}
                publishSavedMatch={publishSavedMatch}
                deleteSavedMatch={deleteSavedMatch}
              />
            ) 
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ManageSavedSchedule;