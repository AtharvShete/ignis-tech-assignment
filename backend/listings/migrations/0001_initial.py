# Generated by Django 5.1.7 on 2025-03-31 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('property_type', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=255)),
                ('address', models.TextField()),
                ('price_per_night', models.DecimalField(decimal_places=2, max_digits=10)),
                ('currency', models.CharField(max_length=10)),
                ('cleaning_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('service_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('image_urls', models.JSONField()),
                ('ratings', models.DecimalField(decimal_places=2, max_digits=3)),
                ('description', models.TextField()),
                ('reviews', models.JSONField(blank=True, null=True)),
                ('number_of_reviews', models.IntegerField()),
                ('review_tags', models.JSONField(blank=True, null=True)),
                ('amenities', models.JSONField()),
                ('total_amenities_count', models.IntegerField(blank=True, null=True)),
                ('amenities_metadata', models.JSONField(blank=True, null=True)),
                ('host', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
    ]
