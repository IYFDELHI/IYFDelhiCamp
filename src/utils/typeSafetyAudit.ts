'use client';

import { TypeGuards, AppTypeGuards } from './typeGuards';

/**
 * Type Safety Audit Utility
 * Provides runtime type checking and reporting for improved type safety
 */

interface TypeSafetyIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'type-assertion' | 'any-usage' | 'missing-validation' | 'unsafe-cast' | 'null-reference';
  message: string;
  location: {
    file?: string | undefined;
    function?: string | undefined;
    line?: number | undefined;
  };
  suggestion?: string | undefined;
  timestamp: number;
}

interface TypeSafetyReport {
  totalIssues: number;
  issuesBySeverity: Record<string, number>;
  issuesByCategory: Record<string, number>;
  issues: TypeSafetyIssue[];
  generatedAt: string;
  recommendations: string[];
}

class TypeSafetyAuditor {
  private issues: TypeSafetyIssue[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  constructor() {
    if (this.isEnabled) {
      this.setupGlobalErrorHandling();
    }
  }

  // Report a type safety issue
  reportIssue(
    severity: TypeSafetyIssue['severity'],
    category: TypeSafetyIssue['category'],
    message: string,
    location: TypeSafetyIssue['location'] = {},
    suggestion?: string | undefined
  ): void {
    if (!this.isEnabled) return;

    const issue: TypeSafetyIssue = {
      id: `ts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      severity,
      category,
      message,
      location,
      suggestion,
      timestamp: Date.now()
    };

    this.issues.push(issue);

    // Log critical issues immediately
    if (severity === 'critical') {
      console.error('🚨 Critical Type Safety Issue:', issue);
    } else if (severity === 'high') {
      console.warn('⚠️ High Priority Type Safety Issue:', issue);
    }
  }

  // Validate function parameters
  validateParameters<T extends Record<string, unknown>>(
    functionName: string,
    parameters: T,
    schema: { [K in keyof T]: (value: unknown) => value is T[K] },
    location: TypeSafetyIssue['location'] = {}
  ): boolean {
    let isValid = true;

    Object.entries(schema).forEach(([key, validator]) => {
      const value = parameters[key];
      
      if (!validator(value)) {
        isValid = false;
        this.reportIssue(
          'high',
          'missing-validation',
          `Parameter '${key}' in function '${functionName}' failed type validation`,
          { ...location, function: functionName },
          `Add proper type validation for parameter '${key}'`
        );
      }
    });

    return isValid;
  }

  // Validate API responses
  validateApiResponse<T>(
    response: unknown,
    validator: (data: unknown) => data is T,
    endpoint: string
  ): T | null {
    if (!AppTypeGuards.isApiResponse(response)) {
      this.reportIssue(
        'high',
        'missing-validation',
        `Invalid API response structure from endpoint: ${endpoint}`,
        { function: 'validateApiResponse' },
        'Ensure API responses follow the expected structure'
      );
      return null;
    }

    if (response.data && !validator(response.data)) {
      this.reportIssue(
        'medium',
        'missing-validation',
        `API response data validation failed for endpoint: ${endpoint}`,
        { function: 'validateApiResponse' },
        'Add proper data validation for API responses'
      );
      return null;
    }

    return response.data as T;
  }

  // Check for unsafe type assertions
  checkUnsafeAssertion(
    value: unknown,
    assertedType: string,
    location: TypeSafetyIssue['location'] = {}
  ): void {
    if (value === null || value === undefined) {
      this.reportIssue(
        'critical',
        'unsafe-cast',
        `Unsafe type assertion to '${assertedType}' on null/undefined value`,
        location,
        'Use type guards or null checks before type assertions'
      );
    }
  }

  // Monitor for 'any' type usage
  reportAnyUsage(
    variableName: string,
    location: TypeSafetyIssue['location'] = {}
  ): void {
    this.reportIssue(
      'medium',
      'any-usage',
      `Variable '${variableName}' is using 'any' type`,
      location,
      'Replace any type with specific type definitions'
    );
  }

  // Validate object properties before access
  safePropertyAccess<T extends Record<string, unknown>, K extends keyof T>(
    obj: unknown,
    property: K,
    location: TypeSafetyIssue['location'] = {}
  ): T[K] | undefined {
    if (!TypeGuards.isObject(obj)) {
      this.reportIssue(
        'medium',
        'null-reference',
        `Attempted to access property '${String(property)}' on non-object value`,
        location,
        'Validate object before property access'
      );
      return undefined;
    }

    if (!(property in obj)) {
      this.reportIssue(
        'low',
        'missing-validation',
        `Property '${String(property)}' does not exist on object`,
        location,
        'Check property existence before access'
      );
      return undefined;
    }

    return (obj as Record<string, unknown>)[property as string] as T[K];
  }

  // Validate array access
  safeArrayAccess<T>(
    array: unknown,
    index: number,
    location: TypeSafetyIssue['location'] = {}
  ): T | undefined {
    if (!TypeGuards.isArray<T>(array)) {
      this.reportIssue(
        'high',
        'null-reference',
        `Attempting to access array index ${index} on non-array value`,
        location,
        'Add array type checks before index access'
      );
      return undefined;
    }

    if (index < 0 || index >= array.length) {
      this.reportIssue(
        'medium',
        'null-reference',
        `Array index ${index} is out of bounds (length: ${array.length})`,
        location,
        'Check array bounds before accessing elements'
      );
      return undefined;
    }

    return array[index];
  }

  // Validate function calls
  safeFunctionCall<T extends (...args: unknown[]) => unknown>(
    fn: unknown,
    functionName: string,
    location: TypeSafetyIssue['location'] = {}
  ): T | null {
    if (!TypeGuards.isFunction(fn)) {
      this.reportIssue(
        'critical',
        'null-reference',
        `Attempting to call '${functionName}' which is not a function`,
        location,
        'Add function type checks before calling'
      );
      return null;
    }

    return fn as T;
  }

  // Generate comprehensive type safety report
  generateReport(): TypeSafetyReport {
    const issuesBySeverity = this.issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const issuesByCategory = this.issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recommendations = this.generateRecommendations();

    return {
      totalIssues: this.issues.length,
      issuesBySeverity,
      issuesByCategory,
      issues: [...this.issues],
      generatedAt: new Date().toISOString(),
      recommendations
    };
  }

  // Generate recommendations based on issues
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const report = this.generateBasicStats();

    if (report.criticalIssues > 0) {
      recommendations.push('🚨 Address critical type safety issues immediately to prevent runtime errors');
    }

    if (report.anyUsage > 0) {
      recommendations.push('📝 Replace any types with specific type definitions for better type safety');
    }

    if (report.unsafeCasts > 0) {
      recommendations.push('🛡️ Replace unsafe type assertions with type guards and validation');
    }

    if (report.missingValidation > 0) {
      recommendations.push('✅ Add runtime validation for external data sources and API responses');
    }

    if (report.nullReferences > 0) {
      recommendations.push('🔍 Add null/undefined checks before accessing properties or calling methods');
    }

    if (this.issues.length === 0) {
      recommendations.push('✨ Great job! No type safety issues detected');
    }

    return recommendations;
  }

  // Get basic statistics
  private generateBasicStats() {
    return {
      criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
      anyUsage: this.issues.filter(i => i.category === 'any-usage').length,
      unsafeCasts: this.issues.filter(i => i.category === 'unsafe-cast').length,
      missingValidation: this.issues.filter(i => i.category === 'missing-validation').length,
      nullReferences: this.issues.filter(i => i.category === 'null-reference').length
    };
  }

  // Setup global error handling for type-related errors
  private setupGlobalErrorHandling(): void {
    if (typeof window === 'undefined') return;

    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const message = args.join(' ');
      
      // Detect common type-related errors
      if (message.includes('Cannot read property') || message.includes('Cannot read properties')) {
        this.reportIssue(
          'high',
          'null-reference',
          'Null reference error detected in console',
          {},
          'Add null checks before property access'
        );
      }
      
      if (message.includes('is not a function')) {
        this.reportIssue(
          'high',
          'null-reference',
          'Function call error detected in console',
          {},
          'Add function type checks before calling'
        );
      }

      originalError.apply(console, args);
    };
  }

  // Clear all issues
  clearIssues(): void {
    this.issues = [];
  }

  // Get issues by severity
  getIssuesBySeverity(severity: TypeSafetyIssue['severity']): TypeSafetyIssue[] {
    return this.issues.filter(issue => issue.severity === severity);
  }

  // Get issues by category
  getIssuesByCategory(category: TypeSafetyIssue['category']): TypeSafetyIssue[] {
    return this.issues.filter(issue => issue.category === category);
  }

  // Export issues for external analysis
  exportIssues(): string {
    return JSON.stringify(this.generateReport(), null, 2);
  }

  // Enable/disable auditing
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Check if auditing is enabled
  isAuditingEnabled(): boolean {
    return this.isEnabled;
  }
}

// Singleton instance
const typeSafetyAuditor = new TypeSafetyAuditor();

// Utility functions for common type safety patterns
export const TypeSafety = {
  // Safe property access with auditing
  safeGet: <T extends Record<string, unknown>, K extends keyof T>(
    obj: unknown,
    property: K,
    location?: TypeSafetyIssue['location'] | undefined
  ): T[K] | undefined => {
    return typeSafetyAuditor.safePropertyAccess<T, K>(obj, property, location);
  },

  // Safe array access with auditing
  safeArrayGet: <T>(
    array: unknown,
    index: number,
    location?: TypeSafetyIssue['location'] | undefined
  ): T | undefined => {
    return typeSafetyAuditor.safeArrayAccess<T>(array, index, location);
  },

  // Safe function call with auditing
  safeCall: <T extends (...args: unknown[]) => unknown>(
    fn: unknown,
    functionName: string,
    location?: TypeSafetyIssue['location'] | undefined
  ): T | null => {
    return typeSafetyAuditor.safeFunctionCall<T>(fn, functionName, location);
  },

  // Validate and report
  validate: <T extends Record<string, unknown>>(
    functionName: string,
    parameters: T,
    schema: { [K in keyof T]: (value: unknown) => value is T[K] },
    location?: TypeSafetyIssue['location'] | undefined
  ): boolean => {
    return typeSafetyAuditor.validateParameters(functionName, parameters, schema, location);
  },

  // Report type safety issue
  report: (
    severity: TypeSafetyIssue['severity'],
    category: TypeSafetyIssue['category'],
    message: string,
    location?: TypeSafetyIssue['location'] | undefined,
    suggestion?: string | undefined
  ): void => {
    typeSafetyAuditor.reportIssue(severity, category, message, location, suggestion);
  }
};

export default typeSafetyAuditor;
export type { TypeSafetyIssue, TypeSafetyReport };