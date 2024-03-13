
export const metadata = {
    title: "Superadmin",
}

function LayoutSuperUser({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-10 py-10">{children}</div>
    )
}

export default LayoutSuperUser