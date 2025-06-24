
export class ConflictResolver {
  generateAlternativeTimes(
    originalStart: Date,
    originalEnd: Date,
    conflictingDates: Date[]
  ): { start: Date; end: Date }[] {
    const alternatives = [];
    const duration = originalEnd.getTime() - originalStart.getTime();

    // Suggest earlier time
    const earlierStart = new Date(originalStart.getTime() - duration);
    const earlierEnd = new Date(originalEnd.getTime() - duration);
    alternatives.push({ start: earlierStart, end: earlierEnd });

    // Suggest later time
    const laterStart = new Date(originalEnd.getTime());
    const laterEnd = new Date(originalEnd.getTime() + duration);
    alternatives.push({ start: laterStart, end: laterEnd });

    return alternatives;
  }

  generateRecommendations(
    conflicts: any[],
    alternatives: any[],
    startDate: Date,
    endDate: Date
  ): string[] {
    const recommendations: string[] = [];

    if (conflicts.length > 0) {
      recommendations.push(
        `Det er ${conflicts.length} konfliktende booking(er) i denne tidsperioden.`
      );

      const duration = endDate.getTime() - startDate.getTime();
      const earlierTime = new Date(startDate.getTime() - duration);
      const laterTime = new Date(endDate.getTime() + duration);

      recommendations.push(
        `Prøv en time tidligere (${earlierTime.toLocaleTimeString('no-NO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}) eller senere (${laterTime.toLocaleTimeString('no-NO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}).`
      );
    }

    if (alternatives.length > 0) {
      const altNames = alternatives.slice(0, 3).map(alt => alt.name).join(', ');
      recommendations.push(
        `Alternative lokaler: ${altNames}${alternatives.length > 3 ? ` og ${alternatives.length - 3} andre` : ''}.`
      );
    }

    // Day-specific recommendations
    const dayOfWeek = startDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      recommendations.push(
        'Vurdér ukedager for bedre tilgjengelighet og lavere priser.'
      );
    }

    // Time-specific recommendations
    const hour = startDate.getHours();
    if (hour >= 17 && hour <= 22) {
      recommendations.push(
        'Kveldstid har høy etterspørsel. Vurdér dagtid for bedre tilgjengelighet.'
      );
    }

    return recommendations;
  }
}
