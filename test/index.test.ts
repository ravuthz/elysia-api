import { describe, expect, it } from 'bun:test'

import { apiCall } from '@/utils/test';

describe('Api Root', () => {
    it('return a response json', async () => {
        const res = await apiCall('api');
        
        expect(res).toEqual({ message: 'API' })
    })
})