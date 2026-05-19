import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import AttendanceItem from "../../components/ui/AttendanceItem";
import Loading from "../../components/ui/Loading";
import { useFetch } from "../../hooks/useFetch";
import { getRiwayatKehadiran } from "../../services/kehadiran.service";

export default function RiwayatKehadiranPage() {
  const { data, loading, error } = useFetch(getRiwayatKehadiran, [], {
    fallback: { summary: { present: 0, late: 0, absent: 0 }, items: [] },
  });

  return (
    <PageContainer role="mahasiswa" title="Attendance History" subtitle="Riwayat presensi lengkap per mata kuliah.">
      <section className="grid grid-cols-3 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-center text-xs text-zinc-600 sm:rounded-3xl sm:gap-4 sm:p-4 sm:text-sm">
        <span>Present: {data?.summary?.present ?? 0}</span>
        <span>Late: {data?.summary?.late ?? 0}</span>
        <span>Absent: {data?.summary?.absent ?? 0}</span>
      </section>

      {loading ? <Loading /> : null}
      {error ? <Alert tone="warning" message={error.message} /> : null}

      <section className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
        {data?.items?.length ? (
          data.items.map((item) => (
            <AttendanceItem
              key={item.id_kehadiran}
              title={item.nama_matkul}
              date={new Date(item.tanggal).toLocaleDateString("id-ID")}
              time={item.waktu_mulai?.slice(0, 5)}
              status={item.status_kehadiran}
              subtitle={item.kode_matkul || "Tanpa kode"}
            />
          ))
        ) : (
          !loading && <Alert tone="info" message="Belum ada riwayat kehadiran." />
        )}
      </section>
    </PageContainer>
  );
}
