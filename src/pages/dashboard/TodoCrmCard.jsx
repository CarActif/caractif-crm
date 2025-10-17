import React, { useState } from "react";

export default function TodoCrmCard({
	todos = [],
	onAdd,
	onToggle,
	onDelete,
	onEdit,
	loading = false,
}) {
	const [newTodo, setNewTodo] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState("");

	const handleAdd = (e) => {
		e.preventDefault();
		if (!newTodo.trim()) return;
		onAdd && onAdd(newTodo);
		setNewTodo("");
	};

	const handleEditSave = (id) => {
		if (!editingText.trim()) return;
		onEdit && onEdit(id, editingText);
		setEditingId(null);
		setEditingText("");
	};

	return (
		<div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4">
			<h3 className="font-bold text-[#4ADE80] mb-2 text-lg">To-do CRM</h3>
			<form onSubmit={handleAdd} className="flex gap-2 mb-4">
				<input
					type="text"
					value={newTodo}
					onChange={e => setNewTodo(e.target.value)}
					className="border rounded px-3 py-2 text-white bg-black/80 flex-1 focus:ring-2 focus:ring-[#4ADE80] text-base placeholder-gray-400"
					placeholder="Ajouter une tâche..."
				/>
				<button type="submit" className="px-4 py-2 bg-[#4ADE80] text-black rounded font-bold hover:bg-[#6EE7B7] transition-all">
					Ajouter
				</button>
			</form>
			<div className="max-h-64 overflow-auto">
				{loading ? (
					<p className="text-gray-200 pl-2">Chargement…</p>
				) : (
					<ul className="space-y-2">
						{todos.map((todo) => (
							<li key={todo.id} className="flex items-center gap-3 group text-xs sm:text-base bg-[#181e29] rounded-lg px-3 py-2 border border-transparent hover:border-[#4ADE80] transition-all">
								<input
									type="checkbox"
									checked={todo.done}
									onChange={() => onToggle && onToggle(todo.id, todo.done)}
									className="accent-[#4ADE80]"
								/>
								{editingId === todo.id ? (
									<div className="flex flex-col sm:flex-row gap-2 w-full bg-[#232b3a] p-3 rounded-lg border border-[#4ADE80] shadow-lg">
										<input
											type="text"
											value={editingText}
											onChange={e => setEditingText(e.target.value)}
											className="border rounded px-3 py-2 text-white bg-black/80 flex-1 focus:ring-2 focus:ring-[#4ADE80] text-base placeholder-gray-400"
											autoFocus
											onKeyDown={e => {
												if (e.key === 'Enter') handleEditSave(todo.id);
												if (e.key === 'Escape') { setEditingId(null); setEditingText(""); }
											}}
											placeholder="Modifier la tâche..."
										/>
										<div className="flex gap-2 mt-2 sm:mt-0">
											<button onClick={() => handleEditSave(todo.id)} className="px-4 py-2 bg-[#4ADE80] text-black rounded font-bold hover:bg-[#6EE7B7] transition-all">Valider</button>
											<button onClick={() => { setEditingId(null); setEditingText(""); }} className="px-4 py-2 bg-gray-300 text-black rounded font-bold hover:bg-gray-400 transition-all">Annuler</button>
										</div>
									</div>
								) : (
									<>
										<span className={todo.done ? "line-through text-gray-500" : "text-white"}>
											{todo.text}
										</span>
										<button
											onClick={() => { setEditingId(todo.id); setEditingText(todo.text); }}
											className="ml-2 text-blue-400 hover:text-blue-600 transition text-sm font-bold"
											title="Modifier"
										>Modifier</button>
									</>
								)}
								<button
									onClick={() => onDelete && onDelete(todo.id)}
									className="ml-auto text-red-400 hover:text-red-600 transition"
									title="Supprimer"
								>
									🗑
								</button>
							</li>
						))}
						{todos.length === 0 && <li className="text-gray-200">Aucune tâche.</li>}
					</ul>
				)}
			</div>
		</div>
	);
}
