export function mapPlayCenter(row: any) {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.imageUrl,
        address: row.address,
        town: row.town,
        state: row.state,
        phone: row.phone,
        website: row.website,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}