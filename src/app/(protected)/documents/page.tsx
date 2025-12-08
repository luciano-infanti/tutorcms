export default function DocumentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Documents</h1>
                <p className="text-zinc-400">Resources and guides.</p>
            </div>

            <div className="p-12 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                <p>No documents available yet.</p>
            </div>
        </div>
    )
}
