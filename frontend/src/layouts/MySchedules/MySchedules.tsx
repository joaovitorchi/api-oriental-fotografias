import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import servicesService from "services/services-service";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { decodeJWT } from "utils/decode-jwt";
import Rating from "@mui/material/Rating";
import MDAlert from "components/MDAlert";

export const MySchedules = () => {
  type Schedule = {
    id: number;
    serviceId: number;
    userProvider: string | null;
    userScheduler: string | null;
    appointmentDate: string;
    obs?: string;
    approved?: boolean;
    userRating?: number; // Nota atribuída pelo usuário
    schedulerUserId: number;
  };

  type ListMySchedulesResponse = {
    schedules: Schedule[];
  };

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [disabledRatings, setDisabledRatings] = useState<{ [key: number]: boolean }>({});

  const token = localStorage.getItem("token");
  const decodedUser = decodeJWT(token);

  const fetchSchedules = async () => {
    try {
      const response = await servicesService.listMySchedules();
      if (response.schedules && Array.isArray(response.schedules)) {
        const updatedSchedules = response.schedules.map((schedule: Schedule) => ({
          ...schedule,
          userRating: schedule.userRating, // Rating atribuído pelo usuário ou 0
        }));
        setSchedules(updatedSchedules);
      } else {
        setError("Formato inesperado da resposta.");
        setSchedules([]);
      }
    } catch (error) {
      setError("Erro ao buscar agendamentos.");
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleScheduleApproval = async (scheduleId: number, approved: boolean) => {
    try {
      await servicesService.approveDisapproveSchedule(scheduleId, approved);
      setSuccess(`Agendamento ${approved ? "aceito" : "rejeitado"} com sucesso!`);
      fetchSchedules();
    } catch (error) {
      setError("Erro ao atualizar o status do agendamento.");
    }
  };

  const giveScoreToService = async (serviceId: number, score: number) => {
    try {
      await servicesService.giveScoreToService(serviceId, score);
      setSuccess("Avaliação registrada com sucesso!");

      await fetchSchedules();

      setDisabledRatings((prev) => ({ ...prev, [serviceId]: true }));
    } catch (error) {
      setError("Erro ao avaliar o serviço.");
    }
  };

  const columns = [
    { Header: "ID", accessor: "id", width: "5%" },
    { Header: "ID Serviço", accessor: "idServico", width: "5%" },
    { Header: "Nome do Prestador", accessor: "userProvider", width: "5%" },
    { Header: "Nome do Solicitante", accessor: "userScheduler", width: "5%" },
    { Header: "Data", accessor: "data", width: "16.5%" },
    { Header: "Observações", accessor: "observacoes", width: "16.5%" },
    { Header: "Status", accessor: "status", width: "10%" },
    { Header: "Ações", accessor: "acoes", width: "20%" },
  ];

  const rows = schedules.map((schedule) => {
    let status;

    switch (schedule.approved) {
      case true:
        status = "Aceito";
        break;
      case false:
        status = "Desaprovado";
        break;
      default:
        status = "Pendente";
    }

    const isProvider = decodedUser?.userId !== schedule?.schedulerUserId;
    const isScheduler = decodedUser?.userId === schedule?.schedulerUserId;

    return {
      id: schedule.id,
      idServico: schedule.serviceId,
      userProvider: schedule.userProvider || "Usuário não identificado",
      userScheduler: schedule.userScheduler || "Usuário não identificado",
      data: new Date(schedule.appointmentDate).toLocaleString(),
      observacoes: schedule.obs?.trim() || "Nenhuma observação",
      status,
      acoes: (
        <>
          {isProvider && status === "Pendente" && (
            <>
              <MDButton
                color="success"
                onClick={() => handleScheduleApproval(schedule.id, true)}
                style={{
                  marginRight: "10px",
                  padding: "5px 10px",
                }}
              >
                Aceitar
              </MDButton>
              <MDButton
                color="error"
                onClick={() => handleScheduleApproval(schedule.id, false)}
                style={{
                  padding: "5px 10px",
                }}
              >
                Desaprovar
              </MDButton>
            </>
          )}
          {isScheduler && status === "Aceito" && (
            <Rating
              name={`rating-${schedule.id}`}
              value={schedule.userRating} // Exibe a avaliação atual
              onChange={(event, newValue) => {
                if (newValue) giveScoreToService(schedule.serviceId, newValue);
              }}
              disabled={!!disabledRatings[schedule.serviceId] || schedule.userRating > 0} // Garante desabilitação
            />
          )}
        </>
      ),
    };
  });

  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error, success]);

  return (
    <DashboardLayout>
      <DashboardNavbar titleToBradcrumb="Serviços" title="Meus Agendamentos" />
      <MDBox>
        {isLoading ? (
          <p>Carregando agendamentos...</p>
        ) : (
          <>
            {error && <MDAlert color="error">{error}</MDAlert>}
            {success && <MDAlert color="success">{success}</MDAlert>}
            <DataTable
              table={{
                columns,
                rows,
              }}
            />
          </>
        )}
      </MDBox>
    </DashboardLayout>
  );
};
