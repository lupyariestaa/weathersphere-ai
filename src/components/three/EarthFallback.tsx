// EarthFallback is no longer used in the hero — kept in the codebase
// only so EarthSceneLoader still compiles cleanly. Future features
// (e.g. a globe on the Map tab) can reactivate it.
export function EarthFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-48 w-48 animate-float rounded-full bg-gradient-to-br from-sphere-cyan to-sphere-blue opacity-60 blur-sm" />
    </div>
  );
}
