// /src/lib/actions/project.ts
async function initializeProject(userId: string) {
  // Supabase RPC çağrısı: Krediyi 1 düşür ve yeni bir UUID döndür.
  // Bu işlem "atomic" olmalı (Race condition engelleme).
  const { data, error } = await supabase.rpc('create_project_with_credit', {
    user_uuid: userId
  });
  if (error) throw new Error("Yetersiz kredi veya bağlantı hatası");
  return data.new_project_id;
}
const ALLOWED_ACTIONS = {
  "TEXT": { type: "is.workflow.actions.gettext", icon: "text.alignleft" },
  "SPEAK": { type: "is.workflow.actions.speaktext", icon: "bubble.left.and.exclamationmark.fill" },
  "WEATHER": { type: "is.workflow.actions.weather.currentconditions", icon: "cloud.sun.fill" }
};