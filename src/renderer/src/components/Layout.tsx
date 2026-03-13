import { NavLink, Outlet } from 'react-router-dom'
import { Box, MessageSquare, Activity, Settings } from 'lucide-react'
import { cn } from '../lib/utils'
import { useStatusStore } from '../store/useStatusStore'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const SidebarItem = ({
  to,
  icon: Icon,
  label
}: {
  to: string
  icon: React.ElementType
  label: string
}): React.ReactElement => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  )
}

export function Layout(): React.ReactElement {
  const { checkStatus } = useStatusStore()
  const { t } = useTranslation()

  useEffect(() => {
    // Initial check
    checkStatus()
    // Periodic check every 60 seconds
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [checkStatus])

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">Ollama Desktop</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem to="/" icon={Box} label={t('sidebar.models')} />
          <SidebarItem to="/chat" icon={MessageSquare} label={t('sidebar.chat')} />
          <SidebarItem to="/status" icon={Activity} label={t('sidebar.status')} />
          <SidebarItem to="/settings" icon={Settings} label={t('sidebar.settings')} />
        </nav>

        <div className="p-4 border-t">
          {/* Simple status indicator */}
          <StatusIndicator />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

function StatusIndicator(): React.ReactElement {
  const { status } = useStatusStore()
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div
        className={cn('w-2 h-2 rounded-full', status.isRunning ? 'bg-green-500' : 'bg-red-500')}
      />
      <span>{status.isRunning ? `v${status.version}` : t('sidebar.disconnected')}</span>
    </div>
  )
}
