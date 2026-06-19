export default function Modal({ setIsModalOpen }: any) {
    return <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-xl border-0 cursor-pointer">Launch Modal Window Dialog</button>
}