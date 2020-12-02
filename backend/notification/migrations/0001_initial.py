# Generated by Django 3.1.4 on 2020-12-01 14:14

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('noti_id', models.AutoField(primary_key=True, serialize=False)),
                ('noti_job_id', models.IntegerField()),
                ('noti_action', models.CharField(max_length=100)),
                ('noti_status', models.CharField(choices=[('PENDING', 'Pending'), ('DECLINED', 'Declined'), ('MATCHED', 'Matched'), ('PAID', 'Paid'), ('CANCELLED_BY_PHOTOGRAPHER', 'Cancelled by photographer'), ('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'), ('PROCESSING', 'Processing Photos'), ('COMPLETED', 'Completed'), ('CLOSED', 'Closed'), ('REVIEWED', 'Reviewed')], max_length=25)),
                ('noti_description', models.TextField(blank=True, max_length=250, null=True)),
                ('noti_timestamp', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('noti_read', models.CharField(choices=[('UNREAD', 'Unread'), ('READ', 'Read')], default='UNREAD', max_length=10)),
            ],
        ),
    ]
