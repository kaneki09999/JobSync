import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFromEndpoint } from "./apiService";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";

const CheckToken = () => {
    const [searchParams] = useSearchParams();
    const employer_id = searchParams.get("employer_id");
    const token = searchParams.get("token");
    const firstname = searchParams.get("firstname");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!employer_id || !token) {
            setError("Invalid request.");
            setLoading(false);
            return;
        }

        getFromEndpoint(`/CheckToken.php?employer_id=${employer_id}&token=${token}`)
            .then(response => {
                if (response.data.success) {
                    navigate(`/resubmit/${firstname}/${employer_id}/${token}`);
                } else {
                    setError("The system has detected that this token is either expired or previously used.");
                }
            })
            .catch(() => setError("An error occurred while checking the token."))
            .finally(() => setLoading(false));
    }, [employer_id, token, navigate]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(255, 255, 255, 1)", 
                zIndex: 99999999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Checking token validity...</span>
                </Spinner>
            ) : error ? (
                <Card className="text-center p-4 shadow-lg">
                    <Card.Body>
                        <Alert variant="danger">
                            <h4>Access Denied</h4>
                            The system has detected that this token is <br /> either expired or previously used.
                        </Alert>
                        <Button variant="primary" onClick={() => navigate("/")}>
                            Back to Home
                        </Button>
                    </Card.Body>
                </Card>
            ) : null}
        </div>
    );
};

export default CheckToken;
