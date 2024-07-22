import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DbService implements OnModuleInit {
  private client: Client;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.client = new Client({
      user: this.config.getOrThrow('DB_USER'),
      host: 'localhost',
      database: this.config.getOrThrow('DB_NAME'),
      password: this.config.getOrThrow('DB_PASSWORD'),
      port: 3002,
    });

    await this.client.connect();
  }

  async query({ text, values }) {
    const res = await this.client.query({ text, values });

    return res.rows;
  }

  async queryOne({ text, values }) {
    const res = await this.client.query({ text, values });

    return res.rows[0];
  }
}
