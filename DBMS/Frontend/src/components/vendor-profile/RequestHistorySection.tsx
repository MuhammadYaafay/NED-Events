
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Update the request history data type to match what's expected
const requestHistoryData = [
  {
    id: 1,
    eventName: "Tech Conference 2023",
    stallNumber: "B12",
    date: "Oct 15, 2023",
    status: "approved"
  },
  {
    id: 2,
    eventName: "Digital Marketing Summit",
    stallNumber: "A05",
    date: "Nov 20, 2023",
    status: "pending"
  },
  {
    id: 3,
    eventName: "Startup Expo 2023",
    stallNumber: "C08",
    date: "Dec 5, 2023",
    status: "rejected"
  },
];

export function RequestHistorySection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stall Booking Request History</CardTitle>
          <CardDescription>View the status of your stall booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Stall Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestHistoryData.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.eventName}</TableCell>
                  <TableCell>{request.stallNumber}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "default"
                          : request.status === "pending"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {request.status === "approved" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : request.status === "pending" ? (
                        <Clock className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default RequestHistorySection;
