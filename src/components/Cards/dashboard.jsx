export const DashboardCard = (e) => {
  return (
    <div className="border px-3 py-7 bg-white flex flex-col items-left space-y-1 ">
      <h3 className="text-xl font-rubik ">
        {/* Total Number Of Registered Campers: */}
        {e.text}
      </h3>
      <p className="text-text-primary text-[40px] font-rubik-moonrock">
        {/* 450 */}
        {e.number}
        <span className="text-[15px] ml-[6px] text-reddish">Attendees</span>
      </p>
    </div>
  );
};
