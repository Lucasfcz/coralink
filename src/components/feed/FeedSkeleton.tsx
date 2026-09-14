export function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-pulse">
      {/* Skeleton Hero Card */}
      <div className="h-[460px] rounded-3xl bg-[#f1f3f6] lg:col-span-2 p-6 flex flex-col justify-end">
        <div className="h-6 w-32 bg-[#e5e7eb] rounded-full mb-4" />
        <div className="h-8 w-3/4 bg-[#e5e7eb] rounded-xl mb-2" />
        <div className="h-4 w-1/2 bg-[#e5e7eb] rounded-lg" />
      </div>

      {/* Skeleton Stacked Cards */}
      <div className="flex flex-col gap-6">
        <div className="h-[218px] rounded-3xl bg-[#f1f3f6] p-4 flex gap-4">
          <div className="w-40 h-full bg-[#e5e7eb] rounded-2xl shrink-0" />
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="h-4 w-20 bg-[#e5e7eb] rounded-full" />
            <div className="h-5 w-full bg-[#e5e7eb] rounded-lg" />
            <div className="h-4 w-2/3 bg-[#e5e7eb] rounded-lg" />
          </div>
        </div>
        <div className="h-[218px] rounded-3xl bg-[#f1f3f6] p-4 flex gap-4">
          <div className="w-40 h-full bg-[#e5e7eb] rounded-2xl shrink-0" />
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="h-4 w-20 bg-[#e5e7eb] rounded-full" />
            <div className="h-5 w-full bg-[#e5e7eb] rounded-lg" />
            <div className="h-4 w-2/3 bg-[#e5e7eb] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Skeleton Editorial Cards */}
      <div className="h-[440px] rounded-3xl bg-[#f1f3f6] p-6 flex flex-col justify-between">
        <div>
          <div className="h-5 w-28 bg-[#e5e7eb] rounded-full mb-3" />
          <div className="h-7 w-5/6 bg-[#e5e7eb] rounded-xl mb-4" />
          <div className="h-48 w-full bg-[#e5e7eb] rounded-2xl mb-4" />
        </div>
        <div className="h-5 w-1/3 bg-[#e5e7eb] rounded-lg" />
      </div>

      <div className="h-[440px] rounded-3xl bg-[#f1f3f6] p-6 flex flex-col justify-between">
        <div>
          <div className="h-5 w-28 bg-[#e5e7eb] rounded-full mb-3" />
          <div className="h-7 w-5/6 bg-[#e5e7eb] rounded-xl mb-4" />
          <div className="h-48 w-full bg-[#e5e7eb] rounded-2xl mb-4" />
        </div>
        <div className="h-5 w-1/3 bg-[#e5e7eb] rounded-lg" />
      </div>

      <div className="h-[440px] rounded-3xl bg-[#f1f3f6] p-6 flex flex-col justify-between">
        <div>
          <div className="h-5 w-28 bg-[#e5e7eb] rounded-full mb-3" />
          <div className="h-7 w-5/6 bg-[#e5e7eb] rounded-xl mb-4" />
          <div className="h-48 w-full bg-[#e5e7eb] rounded-2xl mb-4" />
        </div>
        <div className="h-5 w-1/3 bg-[#e5e7eb] rounded-lg" />
      </div>
    </div>
  );
}
