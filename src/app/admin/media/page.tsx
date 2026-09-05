import { requireAdmin } from "@/lib/cms/admin-guard";
import { listMedia } from "@/lib/actions/admin-media";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { MediaLibraryGrid } from "@/components/admin/MediaLibraryGrid";

export default async function AdminMediaPage() {
  await requireAdmin();
  const media = await listMedia();

  return (
    <div>
      <h1 className="font-serif text-3xl font-extrabold text-white">Media Library</h1>
      <div className="mt-6">
        <MediaUploadForm />
      </div>
      <MediaLibraryGrid media={media} />
    </div>
  );
}
