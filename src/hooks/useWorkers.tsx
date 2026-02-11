import { useState, useEffect, useMemo } from "react";
import api from "../service/api";
import type { Worker, Department } from "../types/worker";

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [wRes, dRes] = await Promise.all([
        api.get("/workers"),
        api.get("/departments")
      ]);
      // Normalize API responses
      const workersData = Array.isArray(wRes.data) ? wRes.data : (wRes.data?.workers ?? []);
      const departmentsData = Array.isArray(dRes.data) ? dRes.data : (dRes.data?.departments ?? []);
      
      setWorkers(workersData);
      setDepartments(departmentsData);
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to fetch workers";
      setError(message);
      setWorkers([]);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Reset to page 1 whenever filters change so results are always visible
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, departmentFilter]);

  const filteredWorkers = useMemo(() => {
    const list = Array.isArray(workers) ? workers : [];
    return list.filter((w: any) => {
      const matchesSearch = (String(w.first_name) + String(w.last_name) + String(w.email)).toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || w.status === statusFilter;
      const matchesDept = departmentFilter === "all" || w.department_id?.toString() === departmentFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [workers, search, statusFilter, departmentFilter]);

  const totalCount = filteredWorkers.length;

  const paginatedWorkers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredWorkers.slice(start, start + pageSize);
  }, [filteredWorkers, page, pageSize]);

  const deleteWorker = async (id: number) => {
    if (!window.confirm("Delete this worker?")) return;
    try {
      await api.delete(`/workers/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Delete failed");
    }
    fetchData(); // Refresh list
  };

  return {
    workers: paginatedWorkers,
    allFiltered: filteredWorkers,
    departments, isLoading, error,
    search, setSearch, statusFilter, setStatusFilter,
    departmentFilter, setDepartmentFilter,
    deleteWorker, refresh: fetchData,
    page, setPage, pageSize, setPageSize, totalCount
  };
}