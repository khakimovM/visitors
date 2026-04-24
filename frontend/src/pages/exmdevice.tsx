<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
  <h2 className="text-xl font-semibold text-foreground">{t('settings.deviceConfig')}</h2>
  <p className="text-muted-foreground">{t('settings.allDevices')}</p>
</div>

<div className="flex gap-2">
  <Button 
    variant="outline" 
    onClick={handleSyncNow}
    className="gap-2"
  >
    <RefreshCw className="w-4 h-4" />
    {t('settings.syncNow')}
  </Button>
  <Dialog open={isAddDeviceDialogOpen} onOpenChange={setIsAddDeviceDialogOpen}>
    <DialogTrigger asChild>
      <Button className="gap-2">
        <Plus className="w-4 h-4" />
        {t('settings.addDevice')}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('settings.addDevice')}</DialogTitle>
        <DialogDescription>
          {t('settings.allDevices')}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmitDevice(onAddDeviceSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="device-name">{t('settings.deviceName')}</Label>
          <Input
            {...registerDevice('name')}
            id="device-name"
            placeholder={t('settings.deviceName')}
          />
          {errorsDevice.name && (
            <p className="text-destructive text-sm">{errorsDevice.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="device-location">{t('settings.deviceLocation')}</Label>
          <Input
            {...registerDevice('location')}
            id="device-location"
            placeholder={t('settings.deviceLocation')}
          />
          {errorsDevice.location && (
            <p className="text-destructive text-sm">{errorsDevice.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="device-branch">{t('settings.branch')}</Label>
          <Select onValueChange={(value) => registerDevice('branch').onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder={t('settings.branch')} />
            </SelectTrigger>
            <SelectContent>
              {branchConfigs.map((branch) => (
                <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errorsDevice.branch && (
            <p className="text-destructive text-sm">{errorsDevice.branch.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="device-sensitivity">{t('settings.sensitivity')}</Label>
          <Select onValueChange={(value) => registerDevice('sensitivity').onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder={t('settings.sensitivity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Past</SelectItem>
              <SelectItem value="medium">O'rta</SelectItem>
              <SelectItem value="high">Yuqori</SelectItem>
            </SelectContent>
          </Select>
          {errorsDevice.sensitivity && (
            <p className="text-destructive text-sm">{errorsDevice.sensitivity.message}</p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsAddDeviceDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">
            {t('common.add')}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</div>
</div>

{/* Device Stats */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      {t('settings.totalDevices')}
    </CardTitle>
    <Smartphone className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{deviceConfigs.length}</div>
  </CardContent>
</Card>

<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      {t('settings.activeDevices')}
    </CardTitle>
    <Wifi className="h-4 w-4 text-success" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-success">
      {deviceConfigs.filter(d => d.status === 'active').length}
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      {t('settings.inactiveDevices')}
    </CardTitle>
    <WifiOff className="h-4 w-4 text-destructive" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-destructive">
      {deviceConfigs.filter(d => d.status === 'inactive').length}
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      {t('settings.sync')}
    </CardTitle>
    <div className={`h-4 w-4 rounded-full ${networkConfig.autoSync ? 'bg-success' : 'bg-warning'}`} />
  </CardHeader>
  <CardContent>
    <div className="text-sm font-medium">
      {networkConfig.autoSync ? 'Avtomatik' : 'Qo\'lda'}
    </div>
  </CardContent>
</Card>
</div>

{/* Device Configurations Table */}
<Card>
<CardHeader>
  <CardTitle>{t('settings.devicesList')}</CardTitle>
  <CardDescription>{t('settings.allDevices')}</CardDescription>
</CardHeader>
<CardContent className="overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>{t('settings.deviceName')}</TableHead>
        <TableHead className="hidden md:table-cell">{t('settings.deviceLocation')}</TableHead>
        <TableHead className="hidden sm:table-cell">{t('settings.branch')}</TableHead>
        <TableHead className="hidden lg:table-cell">{t('settings.sensitivity')}</TableHead>
        <TableHead>{t('settings.status')}</TableHead>
        <TableHead className="hidden lg:table-cell">{t('settings.lastUpdate')}</TableHead>
        <TableHead className="text-right">{t('common.actions')}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {deviceConfigs.map((device, index) => (
        <motion.tr
          key={device.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <TableCell className="font-medium">
            <div>
              {device.name}
              <div className="md:hidden text-xs text-muted-foreground mt-1">
                {device.location}
              </div>
              <div className="sm:hidden text-xs text-muted-foreground mt-1">
                {device.branch}
              </div>
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">{device.location}</TableCell>
          <TableCell className="hidden sm:table-cell">{device.branch}</TableCell>
          <TableCell className="hidden lg:table-cell">
            <Badge variant={device.sensitivity === 'high' ? 'default' : device.sensitivity === 'medium' ? 'secondary' : 'outline'}>
              {device.sensitivity === 'high' ? 'Yuqori' : device.sensitivity === 'medium' ? 'O\'rta' : 'Past'}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
              {device.status === 'active' ? t('branches.active') : t('branches.inactive')}
            </Badge>
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            {new Date(device.lastUpdated).toLocaleDateString()}
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditDevice(device)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteDevice(device.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </motion.tr>
      ))}
    </TableBody>
  </Table>
</CardContent>
</Card>