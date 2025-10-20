import { useAllNewsletterQueue, useCancelNewsletter, useNewsletters, useSyncKitBroadcasts } from '@/hooks/useSupabaseCMS';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const NewsletterManager = () => {
  const { data: queue, isLoading: queueLoading } = useAllNewsletterQueue();
  const { data: newsletters, isLoading: newslettersLoading } = useNewsletters();
  const cancelNewsletter = useCancelNewsletter();
  const { mutate: syncBroadcasts, isPending: isSyncing } = useSyncKitBroadcasts();

  const isLoading = queueLoading || newslettersLoading;

  const pendingQueue = queue?.filter(q => q.status === 'pending') || [];
  const sendingQueue = queue?.filter(q => q.status === 'sending') || [];
  const sentQueue = queue?.filter(q => q.status === 'sent') || [];
  const failedQueue = queue?.filter(q => q.status === 'failed') || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card with Sync Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Newsletter Statistics
            </CardTitle>
            <Button onClick={() => syncBroadcasts()} disabled={isSyncing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync from ConvertKit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-blue-600">{pendingQueue.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Sent</p>
              <p className="text-3xl font-bold text-green-600">{sentQueue.length}</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Failed</p>
              <p className="text-3xl font-bold text-red-600">{failedQueue.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ConvertKit Broadcasts */}
      {newsletters && newsletters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ConvertKit Broadcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletters.slice(0, 20).map((newsletter) => (
                  <TableRow key={newsletter.id}>
                    <TableCell className="font-medium">{newsletter.subject}</TableCell>
                    <TableCell>
                      <Badge variant={newsletter.status === 'sent' ? 'default' : 'secondary'}>
                        {newsletter.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{newsletter.recipient_count?.toLocaleString() || 0}</TableCell>
                    <TableCell>
                      {newsletter.open_rate ? `${newsletter.open_rate.toFixed(1)}%` : '—'}
                    </TableCell>
                    <TableCell>
                      {newsletter.sent_at
                        ? format(new Date(newsletter.sent_at), 'MMM d, yyyy')
                        : newsletter.scheduled_for
                        ? format(new Date(newsletter.scheduled_for), 'MMM d, yyyy')
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pending Queue */}
      {pendingQueue.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Newsletters
          </h3>
          <div className="space-y-3">
            {pendingQueue.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.post?.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.scheduled_for).toLocaleString()}
                        </span>
                        <span>by {item.post?.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelNewsletter.mutate(item.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sending Queue */}
      {sendingQueue.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 animate-pulse" />
            Currently Sending
          </h3>
          <div className="space-y-3">
            {sendingQueue.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.post?.title}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        Sending now...
                      </div>
                    </div>
                    <Badge variant="default" className="bg-blue-600">
                      <Mail className="w-3 h-3 mr-1 animate-pulse" />
                      Sending
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Failed Queue */}
      {failedQueue.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Failed Newsletters
          </h3>
          <div className="space-y-3">
            {failedQueue.map((item) => (
              <Card key={item.id} className="border-red-200 dark:border-red-900">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.post?.title}</h4>
                      <div className="text-sm text-red-600 mt-1">
                        {item.error_message || 'Failed to send'}
                      </div>
                    </div>
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Failed
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sent Queue */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Recently Sent ({sentQueue.length})
        </h3>
        <div className="space-y-3">
          {sentQueue.slice(0, 10).map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.post?.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {new Date(item.sent_at).toLocaleString()}
                      </span>
                      {item.broadcast_id && (
                        <span className="text-xs">
                          Broadcast: {item.broadcast_id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Sent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsletterManager;
