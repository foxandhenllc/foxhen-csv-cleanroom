import type { CleanroomProfile } from "../lib/csvCleanroom.js";

type ProfilePickerProps = {
  profiles: CleanroomProfile[];
  selectedProfileId: string;
  onSelectProfile: (profileId: string) => void;
};

export function ProfilePicker({ profiles, selectedProfileId, onSelectProfile }: ProfilePickerProps) {
  return (
    <div className="profile-grid" role="list" aria-label="CSV cleaning profiles">
      {profiles.map((profile) => (
        <button
          key={profile.id}
          type="button"
          className={profile.id === selectedProfileId ? "profile-card selected" : "profile-card"}
          onClick={() => onSelectProfile(profile.id)}
        >
          <span>{profile.id}</span>
          <strong>{profile.label}</strong>
          <small>{profile.description}</small>
          <em>Required: {profile.requiredColumns.join(", ")}</em>
        </button>
      ))}
    </div>
  );
}
