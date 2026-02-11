import { useState, useEffect, useMemo } from "react";
import api from "../service/api";
import type { Department, Worker } from "../types/worker";

export interface DepartmentWithCount extends Department {
  workerCount: number;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dRes, wRes] = await Promise.all([
        api.get("/departments"),
        api.get("/workers")
      ]);

      // Normalize API responses
      const departmentsData = Array.isArray(dRes.data) ? dRes.data : (dRes.data?.departments ?? []);
      const workersData = Array.isArray(wRes.data) ? wRes.data : (wRes.data?.workers ?? []);

      setDepartments(departmentsData);
      setWorkers(workersData);
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to fetch departments";
      setError(message);
      setDepartments([]);
      setWorkers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const departmentsWithCount = useMemo(() => {
    return departments.map((dept) => ({
      ...dept,
      workerCount: workers.filter((w) => w.department_id === dept.id).length,
    }));
  }, [departments, workers]);

  return {
    departments: departmentsWithCount,
    isLoading,
    error,
    refresh: fetchData,
  };
}
