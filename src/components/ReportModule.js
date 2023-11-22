import { Button, Card } from "react-bootstrap"
import ReportTable from "./ReportTable"
import { usePDF } from "react-to-pdf";

function ReportModule() {
  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  return (
    <>
      <Card>
        <Card.Header>
          <Button onClick={() => toPDF()}>Download PDF</Button>
        </Card.Header>
        <Card.Body ref={targetRef}>
          <ReportTable />
        </Card.Body>
      </Card>
    </>
  )
}

export default ReportModule