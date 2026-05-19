import { CheckCircle, Search, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import { deleteKehadiran, getSessionAttendance, markHadir } from "../../services/dosen.service";

export default function MonitoringKehadiranPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const loadData = () => {
    setLoading(true);
    getSessionAttendance(id)
      .then((response) => setData(response.data))
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleMarkHadir = async (idMahasiswa) => {
    setActionLoading((prev) => ({ ...prev, [idMahasiswa]: true }));
    try {
      await markHadir(id, idMahasiswa);
      loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [idMahasiswa]: false }));
    }
  };

  const handleMarkTidakHadir = async (idKehadiran, idMahasiswa) => {
    setActionLoading((prev) => ({ ...prev, [idMahasiswa]: true }));
    try {
      await deleteKehadiran(id, idKehadiran);
      loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [idMahasiswa]: false }));
    }
  };

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return (data?.attendees || []).filter(
      (item) =>
        item.nama_mahasiswa.toLowerCase().includes(normalized) ||
        item.nim.toLowerCase().includes(normalized),
    );
  }, [data, query]);

  return (
    <PageContainer
      role="dosen"
      title="Attendance Report"
      subtitle={
        data?.session
          ? `${data.session.nama_matkul} • ${data.session.kode_matkul || "Tanpa kode"}${data.session.pertemuan_ke ? ` • Pertemuan ke-${data.session.pertemuan_ke}` : ""}`
          : "Monitoring kehadiran per sesi"
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4 sm:space-y-5">
          <Input
            icon={Search}
            placeholder="Search student..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {message ? <Alert tone="error" message={message} /> : null}

          <section className="grid grid-cols-2 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:gap-4 sm:rounded-3xl sm:p-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{data?.summary?.total ?? 0}</p>
              <p className="text-xs text-zinc-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{data?.summary?.present ?? 0}</p>
              <p className="text-xs text-zinc-500">Present</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{data?.summary?.late ?? 0}</p>
              <p className="text-xs text-zinc-500">Late</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{data?.summary?.absent ?? 0}</p>
              <p className="text-xs text-zinc-500">Absent</p>
            </div>
          </section>

          {filtered.length ? (
            filtered.map((item) => {
              const isHadir = item.status_kehadiran === "hadir" || item.status_kehadiran === "terlambat";
              const isLoading = actionLoading[item.id_mahasiswa];

              return (
                <Card
                  key={item.id_mahasiswa}
                  className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
                >
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">{item.nama_mahasiswa}</h3>
                    <p className="text-xs text-zinc-500 sm:text-sm">
                      {item.nim} • {item.kelas}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.waktu_presensi ? (
                      <p className="text-sm text-zinc-500">
                        {new Date(item.waktu_presensi).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    ) : null}
                    <Badge tone={item.status_kehadiran}>{item.status_kehadiran}</Badge>
                    {isHadir ? (
                      <Button
                        variant="danger"
                        className="gap-1.5 px-3 py-1.5 text-xs"
                        loading={isLoading}
                        onClick={() => handleMarkTidakHadir(item.id_kehadiran, item.id_mahasiswa)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Tidak Hadir
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="gap-1.5 px-3 py-1.5 text-xs"
                        loading={isLoading}
                        onClick={() => handleMarkHadir(item.id_mahasiswa)}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Tandai Hadir
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <Alert tone="info" message="Belum ada mahasiswa yang matching dengan pencarian ini." />
          )}
        </div>
      )}
    </PageContainer>
  );
}