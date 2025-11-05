import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';

const router = Router();

// Dashboard analytics endpoint
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Fetch overview metrics
    const [
      subscribersResult,
      contactsResult,
      propertiesResult,
      recentContactsResult
    ] = await Promise.all([
      // Total subscribers
      supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact' }),

      // Unread contacts (assuming there's a 'read' field)
      supabase
        .from('contact_submissions')
        .select('*', { count: 'exact' })
        .eq('read', false),

      // Properties data
      supabase
        .from('properties')
        .select('price, status'),

      // Recent contacts (last 7 days)
      supabase
        .from('contact_submissions')
        .select('*', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Handle potential null/undefined results with defaults
    const totalSubscribers = subscribersResult.count || 0;
    const unreadContacts = contactsResult.count || 0;
    const recentContacts = recentContactsResult.count || 0;

    // Process properties data safely
    const propertiesData = propertiesResult.data || [];
    const availableProperties = propertiesData.filter(p => p?.status === 'active').length;
    const propertyPrices = propertiesData
      .map(p => p?.price)
      .filter((price): price is number => typeof price === 'number' && price > 0);

    const averagePrice = propertyPrices.length > 0
      ? Math.round(propertyPrices.reduce((sum, price) => sum + price, 0) / propertyPrices.length)
      : 0;

    // Fetch segmentation data
    const [subscribersByCommResult, contactsByTypeResult] = await Promise.all([
      supabase
        .from('newsletter_subscribers')
        .select('community'),

      supabase
        .from('contact_submissions')
        .select('lead_type')
    ]);

    // Process segmentation data safely
    const subscribersData = subscribersByCommResult.data || [];
    const contactsData = contactsByTypeResult.data || [];

    const subscribersByCommunity = subscribersData.reduce((acc: Record<string, number>, sub) => {
      const community = sub?.community || 'Unknown';
      acc[community] = (acc[community] || 0) + 1;
      return acc;
    }, {});

    const contactsByType = contactsData.reduce((acc: Record<string, number>, contact) => {
      const type = contact?.lead_type || 'General Inquiry';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Fetch recent activity (mock data for now since we don't have audit logs)
    const recentActivity = [
      {
        id: 1,
        action: 'INSERT',
        table: 'newsletter_subscribers',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userEmail: 'system@outriderrealty.com'
      },
      {
        id: 2,
        action: 'UPDATE',
        table: 'contact_submissions',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        userEmail: 'kevin.landen@outriderrealty.com'
      },
      {
        id: 3,
        action: 'INSERT',
        table: 'properties',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        userEmail: 'kevin.landen@outriderrealty.com'
      }
    ];

    const response = {
      success: true,
      data: {
        overview: {
          totalSubscribers,
          unreadContacts,
          recentContacts,
          availableProperties,
          averagePrice
        },
        segmentation: {
          subscribersByCommunity,
          contactsByType
        },
        recentActivity
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Trends data endpoint
router.get('/trends/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { timeframe = '6months' } = req.query;

    // Calculate date range based on timeframe
    let startDate: Date;
    const endDate = new Date();

    switch (timeframe as string) {
      case '1month':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // 6months
        startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    }

    let chartData: Array<{ date: string; count: number }> = [];

    if (type === 'subscribers') {
      const result = await supabase
        .from('newsletter_subscribers')
        .select('subscribed_at')
        .gte('subscribed_at', startDate.toISOString())
        .lte('subscribed_at', endDate.toISOString())
        .order('subscribed_at');

      const data = result.data || [];

      // Group by month for chart data
      const monthlyData: Record<string, number> = {};
      data.forEach(item => {
        if (item?.subscribed_at) {
          const month = new Date(item.subscribed_at).toISOString().substring(0, 7);
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        }
      });

      chartData = Object.entries(monthlyData).map(([date, count]) => ({
        date,
        count
      }));

    } else if (type === 'contacts') {
      const result = await supabase
        .from('contact_submissions')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      const data = result.data || [];

      // Group by month for chart data
      const monthlyData: Record<string, number> = {};
      data.forEach(item => {
        if (item?.created_at) {
          const month = new Date(item.created_at).toISOString().substring(0, 7);
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        }
      });

      chartData = Object.entries(monthlyData).map(([date, count]) => ({
        date,
        count
      }));

    } else if (type === 'market') {
      // Mock market data - in production, this would come from your market data tables
      chartData = [
        { date: '2024-01', count: 125000 },
        { date: '2024-02', count: 128000 },
        { date: '2024-03', count: 132000 },
        { date: '2024-04', count: 135000 },
        { date: '2024-05', count: 138000 },
        { date: '2024-06', count: 142000 }
      ];
    }

    res.json({
      success: true,
      data: {
        chartData,
        timeframe,
        type
      }
    });

  } catch (error) {
    console.error('Trends analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trends data',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// System health endpoint
router.get('/health', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();

    // Test database connectivity
    const dbTest = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    const dbLatency = Date.now() - startTime;

    // Memory usage
    const memoryUsage = process.memoryUsage();

    // System health metrics
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: !dbTest.error,
        latency: `${dbLatency}ms`,
        error: dbTest.error?.message || null
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      load: {
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    };

    // Determine overall health status
    if (dbTest.error || dbLatency > 5000) {
      health.status = 'degraded';
      res.status(503);
    } else if (dbLatency > 1000) {
      health.status = 'warning';
    }

    res.json({
      success: true,
      data: health
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      message: 'System health check failed',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

export default router;