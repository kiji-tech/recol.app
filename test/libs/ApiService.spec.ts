import { fetchPlan, fetchPlanList, fetchSchedule, fetchScheduleList } from '@/src/libs/ApiService';
import { Session } from '@supabase/supabase-js';

global.fetch = jest.fn();

describe('ApiService', () => {
  const session: Session = {
    access_token: 'test_token',
    // ...other session properties
  } as Session;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchPlan should fetch plan data', async () => {
    const planId = 'test_plan_id';
    const mockResponse = { data: 'plan_data' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const data = await fetchPlan(planId, session);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/plan/${planId}`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${session.access_token}`,
        }),
      })
    );
    expect(data).toEqual(mockResponse);
  });

  test('fetchPlanList should fetch plan list data', async () => {
    const mockResponse = { data: 'plan_list_data' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const data = await fetchPlanList(session);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/plan/list`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${session.access_token}`,
        }),
      })
    );
    expect(data).toEqual(mockResponse);
  });

  test('fetchSchedule should fetch schedule data', async () => {
    const scheduleId = 'test_schedule_id';
    const mockResponse = { data: 'schedule_data' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const data = await fetchSchedule(scheduleId, session);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/schedule/${scheduleId}`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${session.access_token}`,
        }),
      })
    );
    expect(data).toEqual(mockResponse);
  });

  test('fetchScheduleList should fetch schedule list data', async () => {
    const planId = 'test_plan_id';
    const mockResponse = { data: 'schedule_list_data' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const data = await fetchScheduleList(planId, session);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/schedule/${planId}`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${session.access_token}`,
        }),
      })
    );
    expect(data).toEqual(mockResponse);
  });
});
