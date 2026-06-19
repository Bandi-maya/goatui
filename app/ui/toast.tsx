export default function Toast({addToast}: any) {
    return <button onClick={() => addToast("Sync Complete", "CDN channels updated.", "success")} className="bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-xl border-0 cursor-pointer">Trigger Floating Toast Notification</button>
}