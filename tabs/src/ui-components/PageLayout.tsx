

type Props = {
    children?: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({children}) => {
    return (
        <>

            {children}
        </>
    );
};