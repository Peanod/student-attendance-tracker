import { ArrowRight, Camera, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import AttendanceItem from "../../components/ui/AttendanceItem";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import StatCard from "../../components/ui/StatCard";
import { useFetch } from "../../hooks/useFetch";
import { getMahasiswaDashboard } from "../../services/mahasiswa.service";

export default function MahasiswaDashboard() {
  const { data, loading, error } = useFetch(getMahasiswaDashboard, [], {
    fallback: { profile: null, stats: { mingguIni: "0/5", attendanceRate: 0 }, riwayatTerbaru: [] },
  });

  return (
    <PageContainer
      role="mahasiswa"
      title={data?.profile?.nama_mahasiswa || "Mahasiswa Dashboard"}
      subtitle={data?.profile?.nim || "Lihat statistik kehadiran dan scan QR dosen."}
    >
      {loading ? (
        <Loading />
      ) : (
        <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2">
          <StatCard label="This Week" value={data?.stats?.mingguIni ?? "0/5"} description="Classes attended" />
          <StatCard label="Attendance" value={`${data?.stats?.attendanceRate ?? 0}%`} description="Overall rate" />
        </section>
      )}

      {!loading && (
        <section className="mt-5 sm:mt-6">
          <Link to="/mahasiswa/scan" className="block">
            <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-black text-white p-4 shadow-sm transition hover:bg-zinc-900 sm:rounded-2xl sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Camera className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div>
                  <p className="text-left text-lg font-bold sm:text-xl">Scan QR Code</p>
                  <p className="mt-0.5 text-left text-xs text-zinc-400 sm:text-sm">Mark your attendance</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 shrink-0 text-zinc-400" />
            </div>
          </Link>
        </section>
      )}

      <section className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Attendance</h2>
          <Link to="/mahasiswa/riwayat" className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-600">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {data?.riwayatTerbaru?.length ? (
          data.riwayatTerbaru.map((item) => (
            <AttendanceItem
              key={item.id_kehadiran}
              title={item.nama_matkul}
              date={new Date(item.tanggal).toLocaleDateString("id-ID")}
              time={item.waktu_mulai?.slice(0, 5)}
              status={item.status_kehadiran}
            />
          ))
        ) : (
          <Alert tone="info" message="Belum ada riwayat kehadiran." />
        )}
      </section>
    </PageContainer>
  );
}
