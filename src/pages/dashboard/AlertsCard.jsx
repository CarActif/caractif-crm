import React from "react";

function daysSince(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
	return diff;
}

export default function AlertsCard({ mandats = [] }) {
	// Mandats "Publié" dont created_at ou date_publication > 60 jours
	const now = new Date();
	const alerts = mandats.filter(m => {
		if (m.statut !== "Publié") return false;
		const datePub = m.date_publication || m.created_at;
		if (!datePub) return false;
		return daysSince(datePub) > 60;
	});

	return (
		<div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4 max-h-80 overflow-auto">
			<h3 className="font-bold text-[#4ADE80] mb-2 text-lg">Mandats en retard</h3>
			{alerts.length === 0 ? (
				<div className="text-gray-400 text-sm">Aucun mandat en retard.</div>
			) : (
				<ul className="space-y-2">
					{alerts.map(m => (
						<li key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#181e29] rounded-lg px-3 py-2 border border-transparent hover:border-[#4ADE80] transition-all text-xs sm:text-base">
							<div>
								<span className="font-bold text-black">{m.marque} {m.modele}</span>
							</div>
							<div className="text-gray-500 text-xs sm:text-sm">
								en ligne depuis {daysSince(m.date_publication || m.created_at)} jours
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
