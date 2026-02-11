import { useState, useEffect, useMemo } from "react";
import api from "../service/api";
import type { Worker, Department } from "../types/worker";

export function useReports() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [wRes, dRes] = await Promise.all([
        api.get("/workers"),
        api.get("/departments")
      ]);

      const workersData = Array.isArray(wRes.data) ? wRes.data : (wRes.data?.workers ?? []);
      const departmentsData = Array.isArray(dRes.data) ? dRes.data : (dRes.data?.departments ?? []);

      setWorkers(workersData);
      setDepartments(departmentsData);
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to fetch reports data";
      setError(message);
      setWorkers([]);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalWorkers = workers.length;
    const activeWorkers = workers.filter((w) => w.status === "active").length;
    const inactiveWorkers = workers.filter((w) => w.status === "inactive").length;
    const retiredWorkers = workers.filter((w) => w.status === "retired").length;

    const byDepartment = departments.map((dept) => ({
      name: dept.name,
      count: workers.filter((w) => w.department_id === dept.id).length,
    }));

    const byStatus = [
      { label: "Active", count: activeWorkers, color: "emerald" },
      { label: "Inactive", count: inactiveWorkers, color: "amber" },
      { label: "Retired", count: retiredWorkers, color: "slate" },
    ];

    // Top Positions
    const positionMap: Record<string, number> = {};
    workers.forEach((w) => {
      const pos = w.position || "Unspecified";
      positionMap[pos] = (positionMap[pos] || 0) + 1;
    });

    const topPositions = Object.entries(positionMap)
      .map(([position, count]) => ({ position, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent Hires (sorted by hire_date, newest first)
    const recentHires = workers
      .filter((w) => w.hire_date)
      .sort((a, b) => new Date(b.hire_date!).getTime() - new Date(a.hire_date!).getTime())
      .slice(0, 5)
      .map((w) => ({
        name: `${w.first_name} ${w.last_name}`,
        position: w.position || "—",
        department: w.department_name || "Unassigned",
        hireDate: new Date(w.hire_date!).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }));

    return {
      totalWorkers,
      activeWorkers,
      inactiveWorkers,
      retiredWorkers,
      byDepartment,
      byStatus,
      topPositions,
      recentHires,
    };
  }, [workers, departments]);

  return { stats, isLoading, error, refresh: fetchData };
}
