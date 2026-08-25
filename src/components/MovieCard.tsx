import { ArrowUpRight, Clock } from 'lucide-react';

interface MovieCardProps { id: number; title: string; genre: string; duration: string; image: string; description: string; index: number; onSelectMovie: (id: number) => void; }

export default function MovieCard({ id, title, genre, duration, image, description, index, onSelectMovie }: MovieCardProps) {
  return <article className="group">
    <button type="button" onClick={() => onSelectMovie(id)} className="block w-full text-left focus:outline-none focus:ring-4 focus:ring-[#e65335]/25">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[#ded8ce] shadow-sm">
        <img src={image} alt={`Póster de ${title}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[#fffdf8]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] backdrop-blur">{genre}</span>
        <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-[#e65335] text-white opacity-0 transition duration-300 group-hover:opacity-100"><ArrowUpRight size={19} /></span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3"><div><h2 className="font-display text-2xl leading-none">{title}</h2><p className="mt-2 line-clamp-2 text-sm leading-5 text-[#746d66]">{description}</p></div><span className="pt-1 text-xs font-bold text-[#746d66]">0{index + 1}</span></div>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#254b42]"><Clock size={14} /> {duration} · Ver funciones</p>
    </button>
  </article>;
}
