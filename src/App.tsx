import { useMemo, useState } from 'react';
import { Check, Clapperboard, RotateCcw, Ticket } from 'lucide-react';
import MovieCard from './components/MovieCard';
import ShowTimesSelector from './components/ShowTimesSelector';
import SeatSelector from './components/SeatSelector';
import { generateSeats, movies, showTimes, type Movie, type Seat, type ShowTime } from './data/movies';

type BookingStep = 'movie' | 'showtime' | 'seats';

const steps: { id: BookingStep; label: string }[] = [
  { id: 'movie', label: 'Película' },
  { id: 'showtime', label: 'Función' },
  { id: 'seats', label: 'Butacas' },
];

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowTime, setSelectedShowTime] = useState<ShowTime | null>(null);
  const [seats, setSeats] = useState<Seat[]>(() => generateSeats(8, 10));
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);

  const step: BookingStep = selectedShowTime ? 'seats' : selectedMovie ? 'showtime' : 'movie';
  const currentStepIndex = steps.findIndex(({ id }) => id === step);
  const total = useMemo(() => selectedSeats.length * 8.5, [selectedSeats]);

  const selectMovie = (movieId: number) => {
    setSelectedMovie(movies.find((movie) => movie.id === movieId) ?? null);
    setSelectedShowTime(null);
    setSelectedSeats([]);
    setBookingComplete(false);
  };

  const selectTime = (showTimeId: number) => {
    setSelectedShowTime(showTimes.find((showTime) => showTime.id === showTimeId) ?? null);
    setSeats(generateSeats(8, 10));
    setSelectedSeats([]);
  };

  const toggleSeat = (seatId: string) => {
    setSeats((current) => current.map((seat) => seat.id === seatId
      ? { ...seat, status: seat.status === 'selected' ? 'available' : 'selected' }
      : seat));
    setSelectedSeats((current) => current.includes(seatId)
      ? current.filter((id) => id !== seatId)
      : [...current, seatId]);
  };

  const reset = () => {
    setSelectedMovie(null);
    setSelectedShowTime(null);
    setSelectedSeats([]);
    setBookingComplete(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#191717]">
      <header className="border-b border-[#191717]/10 bg-[#f5f1ea]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button type="button" onClick={reset} className="flex items-center gap-2 text-left" aria-label="Volver al inicio">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e65335] text-white"><Clapperboard size={19} /></span>
            <span className="font-display text-xl tracking-tight">Lumen Cinema</span>
          </button>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[#746d66] sm:block">Tu noche, bien elegida</span>
        </div>
      </header>

      {!bookingComplete && (
        <nav className="mx-auto max-w-7xl px-5 pt-7 sm:px-8" aria-label="Progreso de reserva">
          <ol className="flex max-w-md items-center gap-2">
            {steps.map((item, index) => (
              <li key={item.id} className="flex flex-1 items-center gap-2">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${index < currentStepIndex ? 'bg-[#254b42] text-white' : index === currentStepIndex ? 'bg-[#e65335] text-white' : 'bg-[#ded8ce] text-[#746d66]'}`}>
                  {index < currentStepIndex ? <Check size={15} strokeWidth={3} /> : index + 1}
                </span>
                <span className={`hidden text-xs font-bold uppercase tracking-wider sm:inline ${index <= currentStepIndex ? 'text-[#191717]' : 'text-[#8d857c]'}`}>{item.label}</span>
                {index < steps.length - 1 && <span className={`h-px flex-1 ${index < currentStepIndex ? 'bg-[#254b42]' : 'bg-[#ded8ce]'}`} />}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        {bookingComplete ? (
          <section className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-[#1d2927] p-1 shadow-[0_24px_60px_rgba(25,23,23,.18)]">
            <div className="rounded-[1.8rem] bg-[#fffdf8] px-6 py-12 text-center sm:px-14">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e65335] text-white"><Check size={27} strokeWidth={3} /></span>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#e65335]">Reserva confirmada</p>
              <h1 className="font-display mt-2 text-4xl sm:text-5xl">Nos vemos en la sala.</h1>
              <p className="mx-auto mt-4 max-w-md text-[#645d56]">{selectedMovie?.title} · {selectedShowTime?.time} · Sala 4</p>
              <div className="ticket-cut mt-9 grid gap-5 border-y border-dashed border-[#d9d1c6] py-6 sm:grid-cols-2 sm:text-left">
                <div><p className="ticket-label">Butacas</p><p className="mt-1 font-semibold">{selectedSeats.join(', ')}</p></div>
                <div><p className="ticket-label">Total</p><p className="mt-1 font-semibold">Bs {total.toFixed(2)}</p></div>
              </div>
              <button type="button" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e65335] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#ca4329] focus:outline-none focus:ring-4 focus:ring-[#e65335]/25" onClick={reset}>
                <RotateCcw size={16} /> Nueva reserva
              </button>
            </div>
          </section>
        ) : selectedShowTime && selectedMovie ? (
          <SeatSelector movie={selectedMovie} showTime={selectedShowTime} seats={seats} selectedSeats={selectedSeats} onSelectSeat={toggleSeat} onConfirm={() => setBookingComplete(true)} onBack={() => setSelectedShowTime(null)} />
        ) : selectedMovie ? (
          <ShowTimesSelector movie={selectedMovie} showTimes={showTimes} onSelectTime={selectTime} onBack={() => setSelectedMovie(null)} />
        ) : (
          <>
            <section className="grid gap-6 border-b border-[#191717]/10 pb-10 sm:grid-cols-[1fr_auto] sm:items-end">
              <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e65335]">Cartelera · Hoy</p><h1 className="font-display mt-3 max-w-2xl text-5xl leading-[.94] sm:text-7xl">Elegí la historia que querés vivir.</h1></div>
              <p className="max-w-xs text-sm leading-6 text-[#645d56]">Funciones seleccionadas para una gran noche de cine. Todas las salas cuentan con sonido Dolby Atmos.</p>
            </section>
            <section className="mt-9 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {movies.map((movie, index) => <MovieCard key={movie.id} {...movie} index={index} onSelectMovie={selectMovie} />)}
            </section>
          </>
        )}
      </main>

      {!bookingComplete && selectedMovie && <div className="fixed bottom-4 left-4 hidden items-center gap-2 rounded-full bg-[#1d2927] px-4 py-2 text-xs font-medium text-white shadow-xl lg:flex"><Ticket size={14} /> Reserva protegida por 8 minutos</div>}
    </div>
  );
}

export default App;
