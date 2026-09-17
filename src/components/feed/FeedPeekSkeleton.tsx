export function FeedPeekSkeleton() {
  return (
    <div className="relative w-full overflow-hidden pt-1 pb-4">
      {/* Indicador discreto centralizado */}
      <div className="mb-4 flex items-center justify-center gap-2 text-xs font-medium text-[#64748b] dark:text-[#9aa1ad]">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#121417] dark:border-[#2b303a] dark:border-t-white" />
        <span className="tracking-wide">Carregando mais oportunidades...</span>
      </div>

      {/* Prévia contida dos cards com gradiente de esmaecimento (fade mask) */}
      <div
        className="relative h-44 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
        }}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 opacity-75">
          {/* Topo do Card Hero */}
          <div className="h-48 rounded-3xl border border-[#e5e7eb] bg-white p-6 dark:border-[#242831] dark:bg-[#15181e] lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-[#f1f3f6] dark:bg-[#20242b]" />
              <div className="h-4 w-28 animate-pulse rounded-md bg-[#f1f3f6] dark:bg-[#20242b]" />
            </div>
            <div className="mt-4 h-6 w-3/4 animate-pulse rounded-lg bg-[#f1f3f6] dark:bg-[#20242b]" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-[#f1f3f6] dark:bg-[#20242b]" />
          </div>

          {/* Topo do Card Stacked */}
          <div className="hidden flex-col gap-4 lg:flex">
            <div className="h-48 rounded-3xl border border-[#e5e7eb] bg-white p-5 dark:border-[#242831] dark:bg-[#15181e]">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 animate-pulse rounded-full bg-[#f1f3f6] dark:bg-[#20242b]" />
                <div className="h-3.5 w-24 animate-pulse rounded-md bg-[#f1f3f6] dark:bg-[#20242b]" />
              </div>
              <div className="mt-3 h-5 w-5/6 animate-pulse rounded-lg bg-[#f1f3f6] dark:bg-[#20242b]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
