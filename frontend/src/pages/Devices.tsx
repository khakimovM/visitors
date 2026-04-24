"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Trash2, Plus, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDevices, useCreateDevice, useUpdateDevice, useDeleteDevice } from "@/hooks/useDevices";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useBranches } from "@/hooks/useAnalyticsApi";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DevicesPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: branches } = useBranches();

  const { data, isLoading } = useDevices();
  const devices = data?.devices ?? []
  const createMutation = useCreateDevice();
  const updateMutation = useUpdateDevice();
  const deleteMutation = useDeleteDevice();
  const [isDialogOpen, setIsDialogOpen] = useState(false);  
  const [isEditMode, setIsEditMode] = useState(false);
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [branchUserId, setBranchUserId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [oldUserId, setOldUserId] = useState<number | null>(null);

  const isCreating = createMutation.isPending;
  const isUpdating = updateMutation.isPending;

  const userId = user?.id

  const handleAdd = async () => {
    if (!deviceId)
      return toast.error(t("devices.error"), {
        description: t("devices.deviceId"),
      });

    try {
      await createMutation.mutateAsync({
        userId: Number(branchUserId),
        deviceId: Number(deviceId),
      });

      toast.success(t("devices.addSuccess"), {
        description: `${t("devices.deviceId")}: ${deviceId}`,
      });
      setIsDialogOpen(false);
      setDeviceId(null);
    } catch {
      toast.error(t("devices.error"), {
        description: t("devices.addDevice"),
      });
    }
  };

  const handleEdit = async () => {
    if (!deviceId || !branchUserId || !oldUserId)
      return toast.error(t("devices.error"), {
        description: t("devices.deviceId"),
      });

    try {
      await updateMutation.mutateAsync({
        deviceId: deviceId,
        oldUserId: oldUserId,
        newUserId: branchUserId,
      });

      toast.success(t("devices.editSuccess"), {
        description: `${t("devices.deviceId")}: ${deviceId}`,
      });

      setIsDialogOpen(false);
      setIsEditMode(false);
      setDeviceId(null);
      setBranchUserId(null);
      setOldUserId(null);
    } catch {
      toast.error(t("devices.error"), {
        description: t("devices.editDevice"),
      });
    }
  };

  const handleDelete = async (id: number, userIdd: number) => {
    try {
      setDeletingId(id);
      await deleteMutation.mutateAsync({ userId: Number(userIdd), deviceId: id });
      toast.success(t("devices.deleteSuccess"), {
        description: `${t("devices.deviceId")}: ${id}`,
      });
    } catch {
      toast.error(t("devices.error"), {
        description: t("devices.deleteDevice"),
      });
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (id: number, userId: number) => {
    setDeviceId(id);
    setOldUserId(userId);
    setBranchUserId(userId);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-primary" /> {t("devices.title")}
        </h1>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              {
                user.role === "ADMIN" ? (
                  <Button onClick={() => { setIsEditMode(false); setDeviceId(null); }}>
                    <Plus className="w-4 h-4 mr-2" /> {t("devices.addDevice")}
                  </Button>
                ) :
                  null
              }
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? t("devices.editDevice") : t("devices.addDevice")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Input
                  type="number"
                  placeholder={t("devices.deviceId")}
                  value={deviceId}
                  disabled={isEditMode}
                  onChange={(e) => setDeviceId(Number(e.target.value))}
                />

                <div className="space-y-2">
                  <Label>{t("devices.userSelect")}</Label>

                  <Select
                    onValueChange={(value) => setBranchUserId(Number(value))}
                    value={branchUserId ? String(branchUserId) : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("devices.selectUser")} />
                    </SelectTrigger>

                    <SelectContent>
                      {branches?.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name} — {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={isEditMode ? handleEdit : handleAdd}
                  disabled={isEditMode ? isUpdating : isCreating}
                >
                  {(isEditMode ? isUpdating : isCreating) && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}

                  {isEditMode ? t("common.save") : t("devices.addDevice")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("devices.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : devices && devices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("devices.id")}</TableHead>
                  <TableHead>{t("devices.deviceId")}</TableHead>
                  <TableHead>{t("devices.user")}</TableHead>
                  <TableHead className="text-right">{t("devices.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <motion.tr
                    key={device.deviceId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{device.deviceId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-muted-foreground">{device.user?.username}</span>
                        <span className="text-sm text-gray-500">{device.user?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      {
                        user.role === "ADMIN" ? (
                          <>
                            <Button variant="ghost" className="bg-blue-200 hover:bg-blue-300" size="icon" onClick={() => openEditModal(device.deviceId, device.userId)}>
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-destructive/20 hover:bg-destructive/30"
                              disabled={deletingId === device.deviceId}
                              onClick={() => handleDelete(device.deviceId, device.userId)}
                            >
                              {deletingId === device.deviceId ? (
                                <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-destructive" />
                              )}
                            </Button>
                          </>
                        ) : null
                      }
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <Smartphone className="mx-auto h-12 w-12 opacity-50 mb-3" />
              <p>{t("devices.noData")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DevicesPage;
