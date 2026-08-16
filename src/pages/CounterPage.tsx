import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function CounterPage() {
  const [counter, setCounter] = useState<number | null>(null);

  const incrementCounter = async () => {
    const { error } = await supabase
      .from("counters")
      .update({ value: (counter ?? 0) + 1 })
      .eq("id", 1);

    if (error) {
      console.error("Error al incrementar el contador:", error);
    }
  };

  const decrementCounter = async () => {
    if (counter === null || counter <= 0) {
      return;
    }

    const { error } = await supabase
      .from("counters")
      .update({ value: counter - 1 })
      .eq("id", 1);

    if (error) {
      console.error("Error al decrementar el contador:", error);
    }
  };

  useEffect(() => {
    const getCounter = async () => {
      const { data, error } = await supabase
        .from("counters")
        .select("value")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error al obtener el contador:", error);
        return;
      }

      setCounter(data.value);
    };

    getCounter();

    const channel = supabase
      .channel("counter-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "counters",
          filter: "id=eq.1",
        },
        (payload) => {
          console.log("Cambio recibido:", payload);
          setCounter(payload.new.value);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-6 h-screen overflow-hidden md:px-6 md:py-0">
      <div className="relative flex min-h-screen w-full max-w-5xl flex-col justify-center md:h-full md:min-h-0">
        {/* Título */}
        <h1 className="mb-6 text-center text-2xl font-black uppercase tracking-[0.08em] text-white md:mb-9 md:text-4xl md:tracking-[0.15em]">
          Victimizaciones de Gerardo
        </h1>

        {/* Contenedor principal */}
        <div className="relative mx-auto flex min-h-130 w-full max-w-4xl flex-col items-center rounded-[3rem] border-4 border-[#BF00FF] bg-[#080808] px-5 py-7 shadow-[0_0_15px_rgba(191,0,255,0.8)] md:min-h-70 md:flex-row md:rounded-full md:px-12 md:py-8">
          {/* Onda decorativa de fondo */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-20">
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              {Array.from({ length: 60 }).map((_, index) => (
                <span
                  key={index}
                  className="w-0.75 rounded-full bg-[#BF00FF]"
                  style={{
                    height: `${20 + Math.abs(Math.sin(index * 0.6)) * 90}px`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Imagen de perfil */}
          <div className="relative z-10 shrink-0 rounded-full border-4 border-[#BF00FF] bg-[#080808] p-2 shadow-[0_0_15px_rgba(191,0,255,0.7)]">
            <div className="h-40 w-40 overflow-hidden rounded-full md:h-52 md:w-52">
              <img
                src="/gerardo-v123.png"
                alt="Gerardo"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Contenido del contador */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center pl-8 md:pl-14">
            {/* Número */}
            <div className="font-mono text-7xl font-black leading-none tracking-widest text-[#FF00BF] drop-shadow-[0_0_10px_rgba(255,0,191,0.65)] md:text-9xl">
              {counter}
            </div>

            {/* Separador */}
            <div className="mt-5 flex w-full max-w-md items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#FF00BF] shadow-[0_0_8px_rgba(255,0,191,0.9)]" />

              <div className="h-0.5 flex-1 bg-[#FF00BF] shadow-[0_0_8px_rgba(255,0,191,0.7)]" />

              <span className="h-2 w-2 rounded-full bg-[#FF00BF] shadow-[0_0_8px_rgba(255,0,191,0.9)]" />
            </div>

            {/* Leyenda */}
            <p className="mt-5 text-center text-sm font-bold uppercase tracking-[0.25em] text-white md:text-lg">
              Victimizaciones de Gerardo
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="mt-10 flex justify-center gap-5">
          <button
            onClick={decrementCounter}
            className="h-14 w-20 rounded-full border-2 border-[#BF00FF] bg-[#080808] text-3xl font-bold text-white shadow-[0_0_12px_rgba(191,0,255,0.5)] transition hover:bg-[#BF00FF] hover:text-white cursor-pointer"
          >
            −
          </button>

          <button
            onClick={incrementCounter}
            className="h-14 w-20 rounded-full border-2 border-[#BF00FF] bg-[#080808] text-3xl font-bold text-white shadow-[0_0_12px_rgba(191,0,255,0.5)] transition hover:bg-[#BF00FF] hover:text-white cursor-pointer"
          >
            +
          </button>
        </div>
        {/* Firma */}
        <footer className="absolute bottom-2 left-0 w-full text-center">
          <p className="text-[8px] tracking-wider text-white/50">
            Desarrollado con <span className="text-[#FF00BF]">♥</span> por{" "}
            <span className="font-bold text-white/70">DORIS CONDORI</span>
          </p>
        </footer>
      </div>
    </main>
  );
}

export default CounterPage;
