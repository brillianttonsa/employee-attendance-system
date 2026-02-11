import { SettingsForm } from "../../../components/dashboard/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, security, and preferences
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
