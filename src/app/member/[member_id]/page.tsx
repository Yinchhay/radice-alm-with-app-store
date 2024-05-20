import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function MemberPublicProfilePage({
    params,
}: {
    params: { member_id: string };
}) {
    return (
        <div>
            <Navbar />
            <Footer />
        </div>
    );
}
