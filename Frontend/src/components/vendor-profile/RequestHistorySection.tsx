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

interface RequestHistory {
  booking_id: number;
  event_name: string;
  date: string;
  stall_number: string;
  status: string;
}

interface RequestHistoryProps {
  history: RequestHistory[];
}

export function RequestHistorySection({ history }: RequestHistoryProps) {
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
                <TableHead>Date</TableHead>
                <TableHead>Stall Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((request) => (
                <TableRow key={request.booking_id}>
                  <TableCell className="font-medium">{request.event_name}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.stall_number}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "confirmed"
                          ? "default"
                          : request.status === "pending"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {request.status === "confirmed" ? (
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
